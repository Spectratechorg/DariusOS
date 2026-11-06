import { neon } from '@neondatabase/serverless';
import {
  HEALTH,
  PROJECTS,
  PROJECT_DETAIL,
  ALIGNMENT,
  PROFILE,
  SECTIONS,
  QUANTITIES,
  BEME,
  TERRAIN,
} from './_data.js';

function getNeonSql() {
  const neonUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!neonUrl) return null;
  try {
    return { sql: neon(neonUrl), url: neonUrl };
  } catch (err) {
    console.error('Failed to initialize Neon client:', err);
    return null;
  }
}

export default async function handler(req, res) {
  // CORS & caching headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const rawRoute = (req.query && req.query.route)
    ? (Array.isArray(req.query.route) ? req.query.route.join('/') : String(req.query.route))
    : '';
  const matchedPath = (req.headers && req.headers['x-matched-path']) || '';
  const urlPath = (req.url || '').split('?')[0];
  const target = (rawRoute || matchedPath || urlPath).toLowerCase().replace(/\/$/, '');

  const neonClient = getNeonSql();

  // Health check endpoint
  if (target.includes('health') || target.includes('db-status')) {
    let dbStatus = {
      connected: false,
      provider: 'neon_serverless',
      configured: Boolean(neonClient),
      latency_ms: null,
      database: null,
      error: null,
    };

    if (neonClient) {
      const start = Date.now();
      try {
        const rows = await neonClient.sql`SELECT current_database() as db_name, version() as ver`;
        dbStatus.connected = true;
        dbStatus.latency_ms = Date.now() - start;
        dbStatus.database = rows[0]?.db_name || 'neondb';
      } catch (e) {
        dbStatus.error = String(e.message || e);
      }
    }

    return res.status(200).json({
      ...HEALTH,
      neon: dbStatus,
      database: dbStatus,
    });
  }

  // Projects listing
  if (target.endsWith('projects') || target === 'projects') {
    if (req.method === 'POST') {
      const body = req.body || {};
      const newProj = {
        id: body.id || `proj-${Date.now()}`,
        name: body.name || 'New Road Corridor',
        description: body.description || '',
        created_by_user_id: body.created_by_user_id || 'dev-engineer-001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (neonClient) {
        try {
          await neonClient.sql`
            INSERT INTO projects (id, name, description, created_by_user_id, created_at, updated_at)
            VALUES (${newProj.id}, ${newProj.name}, ${newProj.description}, ${newProj.created_by_user_id}, NOW(), NOW())
          `;
          return res.status(201).json(newProj);
        } catch (e) {
          console.error('Neon insert failed, falling back to dynamic JSON:', e);
        }
      }
      return res.status(201).json(newProj);
    }

    // GET projects
    if (neonClient) {
      try {
        const rows = await neonClient.sql`
          SELECT id, name, description, created_by_user_id, created_at, updated_at
          FROM projects
          ORDER BY created_at DESC
          LIMIT 25
        `;
        if (rows && rows.length > 0) {
          return res.status(200).json(rows);
        }
      } catch (e) {
        console.error('Neon query error for projects:', e);
      }
    }
    return res.status(200).json(PROJECTS);
  }

  // Project Detail
  if (target.match(/projects\/.+/)) {
    return res.status(200).json(PROJECT_DETAIL);
  }

  // Pipeline stage endpoints
  if (target.includes('beme')) {
    return res.status(200).json(BEME);
  }

  if (target.includes('terrain')) {
    return res.status(200).json(TERRAIN);
  }

  if (target.includes('alignment')) {
    return res.status(200).json(ALIGNMENT);
  }

  if (target.includes('profile')) {
    return res.status(200).json(PROFILE);
  }

  if (target.includes('sections')) {
    return res.status(200).json(SECTIONS);
  }

  if (target.includes('quantities')) {
    return res.status(200).json(QUANTITIES);
  }

  // Default fallback
  return res.status(200).json(HEALTH);
}
