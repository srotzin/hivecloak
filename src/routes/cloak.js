'use strict';
const { Router } = require('express');
const engine = require('../services/cloak-engine');
const router = Router();

router.post('/v1/cloak/engage', (req, res) => {
  const { agent_did, type, alias, shield_level, invisibility, duration_hours } = req.body;
  if (!agent_did) return res.status(400).json({ error: 'agent_did required' });
  const cloak = engine.engageCloak(agent_did, { type, alias, shield_level, invisibility, duration_hours });
  res.status(201).json({ status: 'cloaked', cloak });
});

router.post('/v1/cloak/proxy', (req, res) => {
  const { agent_did, facade, relay_mode } = req.body;
  if (!agent_did) return res.status(400).json({ error: 'agent_did required' });
  const proxy = engine.createProxy(agent_did, { facade, relay_mode });
  res.status(201).json({ status: 'proxy_created', proxy });
});

router.post('/v1/cloak/path', (req, res) => {
  const { from_did, to_did, route_type, waypoints, encryption } = req.body;
  if (!from_did || !to_did) return res.status(400).json({ error: 'from_did and to_did required' });
  const path = engine.carvePath(from_did, to_did, { route_type, waypoints, encryption });
  res.status(201).json({ status: 'path_carved', path });
});

router.delete('/v1/cloak/disengage/:id', (req, res) => {
  const result = engine.disengage(req.params.id);
  if (!result) return res.status(404).json({ error: 'Cloak not found' });
  res.json({ status: 'disengaged', cloak: result });
});

router.get('/v1/cloak/stats', (_req, res) => { res.json(engine.getStats()); });
router.get('/v1/cloak/active', (_req, res) => { res.json({ cloaks: engine.listCloaks().filter(c => c.status === 'active'), proxies: engine.listProxies().filter(p => p.status === 'active'), paths: engine.listPaths().filter(p => p.status === 'active') }); });

module.exports = router;
