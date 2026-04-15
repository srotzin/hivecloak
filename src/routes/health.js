'use strict';
const { Router } = require('express');
const hiveClient = require('../services/hive-client');
const { getStats } = require('../services/cloak-engine');
const router = Router();
const BOOT_TIME = new Date().toISOString();

router.get('/health', (_req, res) => { res.json({ status: 'operational', service: 'hivecloak', version: '1.0.0', did: hiveClient.AGENT_DID, uptime_seconds: Math.floor(process.uptime()), boot_time: BOOT_TIME }); });

router.get('/.well-known/hive-pulse.json', (_req, res) => { res.json({ schema: 'hive-pulse/v1', agent: 'hivecloak', did: hiveClient.AGENT_DID, status: 'online', boot_time: BOOT_TIME, uptime_seconds: Math.floor(process.uptime()), capabilities: hiveClient.AGENT_IDENTITY.capabilities, stats: getStats(), pulse_time: new Date().toISOString() }); });

router.get('/.well-known/ai.json', (_req, res) => { res.json({ schema_version: '1.0', name: 'HiveCloak', description: 'Agent stealth service — proxy identity, cloaking, and pathfinding through hostile territory', type: 'agent-service', did: hiveClient.AGENT_DID, capabilities: hiveClient.AGENT_IDENTITY.capabilities, api: { base_url: '/', endpoints: [ { method: 'POST', path: '/v1/cloak/engage', description: 'Engage stealth cloak' }, { method: 'POST', path: '/v1/cloak/proxy', description: 'Create proxy identity' }, { method: 'POST', path: '/v1/cloak/path', description: 'Carve stealth path' }, { method: 'DELETE', path: '/v1/cloak/disengage/:id', description: 'Disengage cloak' }, { method: 'GET', path: '/v1/cloak/stats', description: 'Cloak statistics' } ] } }); });

router.get('/robots.txt', (_req, res) => { res.type('text/plain').send(['User-agent: *', 'Allow: /', '', `# HiveCloak — stealth and cloaking`, `# DID: ${hiveClient.AGENT_DID}`].join('\n')); });

module.exports = router;
