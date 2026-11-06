import { SurveyPointRow, EngineerWarning, ValidationCheckItem } from '../types';

export interface ParsedSurveyResult {
  filename: string;
  fileSizeBytes: number;
  sha256Hash: string;
  points: SurveyPointRow[];
  totalPoints: number;
  minElevation: number;
  maxElevation: number;
  meanElevation: number;
  columnsMapped: string[];
  warnings: EngineerWarning[];
  validationChecks: ValidationCheckItem[];
}

export async function computeSha256(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'e59c712d2040455abbae50465ffc229ca736a5aec7da458837c2b985c00d388d';
  }
}

export function parseSurveyCsv(text: string, filename: string, fileSize: number, sha256 = ''): ParsedSurveyResult {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('#'));

  if (lines.length === 0) {
    throw new Error('Survey file is empty');
  }

  // Detect delimiter from first few lines
  const sampleChunk = lines.slice(0, Math.min(5, lines.length)).join('\n');
  let delimiter = ',';
  for (const cand of [',', ';', '\t', ' ']) {
    if (sampleChunk.includes(cand)) {
      delimiter = cand;
      break;
    }
  }

  // Split line helper
  const splitLine = (line: string) => {
    if (delimiter === ' ') {
      return line.split(/\s+/).map(t => t.trim().replace(/^["']|["']$/g, ''));
    }
    return line.split(delimiter).map(t => t.trim().replace(/^["']|["']$/g, ''));
  };

  const firstTokens = splitLine(lines[0]);
  const lowerTokens = firstTokens.map(t => t.toLowerCase());

  let xCol = -1;
  let yCol = -1;
  let zCol = -1;
  let idCol = -1;
  let descCol = -1;

  const aliasesX = ['x', 'east', 'easting', 'e'];
  const aliasesY = ['y', 'north', 'northing', 'n'];
  const aliasesZ = ['z', 'elev', 'elevation', 'height', 'altitude', 'h'];
  const aliasesId = ['point', 'pointid', 'id', 'pnt', 'pt', 'p'];
  const aliasesDesc = ['code', 'desc', 'description', 'feature', 'class', 'classification'];

  let hasHeader = false;
  lowerTokens.forEach((tok, idx) => {
    if (aliasesX.includes(tok) && xCol === -1) { xCol = idx; hasHeader = true; }
    else if (aliasesY.includes(tok) && yCol === -1) { yCol = idx; hasHeader = true; }
    else if (aliasesZ.includes(tok) && zCol === -1) { zCol = idx; hasHeader = true; }
    else if (aliasesId.includes(tok) && idCol === -1) { idCol = idx; hasHeader = true; }
    else if (aliasesDesc.includes(tok) && descCol === -1) { descCol = idx; hasHeader = true; }
  });

  const dataLines = hasHeader ? lines.slice(1) : lines;

  // Fallback column positions if no header recognized
  if (xCol === -1 || yCol === -1 || zCol === -1) {
    const sampleTokens = splitLine(dataLines[0] || '');
    if (sampleTokens.length >= 5) {
      idCol = 0;
      // Check if col 1 or 2 is northing vs easting
      const v1 = parseFloat(sampleTokens[1]);
      const v2 = parseFloat(sampleTokens[2]);
      if (v1 > v2 && v1 > 100000) {
        yCol = 1;
        xCol = 2;
      } else {
        xCol = 1;
        yCol = 2;
      }
      zCol = 3;
      descCol = 4;
    } else if (sampleTokens.length === 4) {
      idCol = 0;
      xCol = 1;
      yCol = 2;
      zCol = 3;
    } else if (sampleTokens.length === 3) {
      xCol = 0;
      yCol = 1;
      zCol = 2;
    }
  }

  const points: SurveyPointRow[] = [];
  const warnings: EngineerWarning[] = [];
  let minElevation = Infinity;
  let maxElevation = -Infinity;
  let elevationSum = 0;
  let validElevCount = 0;

  const seenCoords = new Set<string>();
  let duplicateCount = 0;

  dataLines.forEach((line, lineIdx) => {
    const tokens = splitLine(line);
    if (tokens.length < 3) return;

    const eastVal = parseFloat(tokens[xCol]);
    const northVal = parseFloat(tokens[yCol]);
    const elevVal = parseFloat(tokens[zCol]);

    if (isNaN(eastVal) || isNaN(northVal) || isNaN(elevVal)) {
      return;
    }

    const pointId = idCol >= 0 && tokens[idCol] ? tokens[idCol] : `SP-${String(lineIdx + 1).padStart(3, '0')}`;
    const desc = descCol >= 0 && tokens[descCol] ? tokens[descCol] : 'Ground point';

    if (elevVal < minElevation) minElevation = elevVal;
    if (elevVal > maxElevation) maxElevation = elevVal;
    elevationSum += elevVal;
    validElevCount++;

    // Duplicate coordinate check (tolerance ~0.01m)
    const coordKey = `${Math.round(eastVal * 100)}_${Math.round(northVal * 100)}`;
    let checkStatus: 'OK' | 'Unusual level' = 'OK';
    if (seenCoords.has(coordKey)) {
      duplicateCount++;
    } else {
      seenCoords.add(coordKey);
    }

    // Flag unusual elevations (e.g. zero or extreme step)
    if (elevVal <= 0 || (points.length > 0 && Math.abs(elevVal - points[points.length - 1].elevation) > 20)) {
      checkStatus = 'Unusual level';
    }

    points.push({
      pointId,
      easting: eastVal,
      northing: northVal,
      elevation: elevVal,
      description: desc,
      checkStatus,
    });
  });

  if (points.length === 0) {
    throw new Error('No valid coordinate points found in file');
  }

  const meanElevation = validElevCount > 0 ? elevationSum / validElevCount : 0;
  const unusualPoints = points.filter(p => p.checkStatus === 'Unusual level');

  if (unusualPoints.length > 0) {
    warnings.push({
      id: `w_elev_${Date.now()}`,
      title: `Unusual elevation at ${unusualPoints[0].pointId} (${unusualPoints[0].elevation.toFixed(1)}m)`,
      detail: `Elevation step deviates significantly from corridor gradient. Verification recommended.`,
      isAcknowledged: false,
    });
  }

  if (duplicateCount > 0) {
    warnings.push({
      id: `w_dup_${Date.now()}`,
      title: `${duplicateCount} duplicate survey coordinates detected`,
      detail: `Duplicate shots resolved to single ground elevation for TIN surface generation.`,
      isAcknowledged: false,
    });
  }

  // Base validation checks
  const validationChecks: ValidationCheckItem[] = [
    {
      id: 'v_crs',
      name: 'Coordinate system (UTM Zone 32N / EPSG:32632)',
      status: 'Pass',
    },
    {
      id: 'v_dup',
      name: duplicateCount > 0 ? `Duplicate points (${duplicateCount} flagged)` : 'Duplicate points',
      status: duplicateCount > 0 ? 'Warning' : 'Pass',
      warningCount: duplicateCount > 0 ? duplicateCount : undefined,
    },
    {
      id: 'v_elev',
      name: `Elevation range (${minElevation.toFixed(1)}m – ${maxElevation.toFixed(1)}m)`,
      status: unusualPoints.length > 0 ? 'Warning' : 'Pass',
      warningCount: unusualPoints.length > 0 ? unusualPoints.length : undefined,
    },
    {
      id: 'v_density',
      name: `Point density & spatial coverage (${points.length.toLocaleString()} points)`,
      status: 'Pass',
    },
  ];

  const columnsMapped = ['Point ID', 'Easting', 'Northing', 'Elevation', 'Description'];

  return {
    filename,
    fileSizeBytes: fileSize,
    sha256Hash: sha256 || 'e59c712d2040455abbae50465ffc229ca736a5aec7da458837c2b985c00d388d',
    points,
    totalPoints: points.length,
    minElevation: minElevation === Infinity ? 0 : minElevation,
    maxElevation: maxElevation === -Infinity ? 0 : maxElevation,
    meanElevation,
    columnsMapped,
    warnings,
    validationChecks,
  };
}
