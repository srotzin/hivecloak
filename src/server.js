'use strict';
const express = require('express');
const cors = require('cors');
const healthRouter = require('./routes/health');
const cloakRouter = require('./routes/cloak');
const hiveClient = require('./services/hive-client');

const app = express();
const PORT = process.env.PORT || 3010;
app.use(cors());
app.use(express.json());
app.use('/', healthRouter);
app.use('/', cloakRouter);

app.get('/', (_req, res) => { res.json({ service: 'hivecloak', version: '1.0.0', description: 'Agent stealth service — proxy identity, cloaking, and pathfinding', endpoints: { engage: 'POST /v1/cloak/engage', proxy: 'POST /v1/cloak/proxy', path: 'POST /v1/cloak/path', disengage: 'DELETE /v1/cloak/disengage/:id', stats: 'GET /v1/cloak/stats', active: 'GET /v1/cloak/active', health: 'GET /health', pulse: 'GET /.well-known/hive-pulse.json', ai: 'GET /.well-known/ai.json' } }); });

app.listen(PORT, async () => {
  console.log(`[hivecloak] Listening on port ${PORT}`);
  try { await hiveClient.registerWithHiveTrust(); } catch (e) { console.error(`[hivecloak] HiveTrust reg failed: ${e.message}`); }
  try { await hiveClient.registerWithHiveGate(); } catch (e) { console.warn(`[hivecloak] HiveGate reg failed: ${e.message}`); }
});

module.exports = app;
