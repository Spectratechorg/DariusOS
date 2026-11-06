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

export default function handler(req, res) {
  // CORS & caching headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

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

  if (target.includes('health')) {
    return res.status(200).json(HEALTH);
  }

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

  if (target.match(/projects\/.+/)) {
    return res.status(200).json(PROJECT_DETAIL);
  }

  if (target.endsWith('projects') || target === 'projects') {
    return res.status(200).json(PROJECTS);
  }

  // Fallback to health
  return res.status(200).json(HEALTH);
}
