'use strict';
const { v4: uuidv4 } = require('uuid');

const cloaks = new Map();
const proxies = new Map();
const paths = new Map();

let stats = { cloaks_issued: 0, proxies_active: 0, paths_carved: 0, agents_protected: 0 };

function engageCloak(agentDid, opts = {}) {
  const id = uuidv4();
  const cloak = {
    id, agent_did: agentDid, type: opts.type || 'standard',
    alias: opts.alias || `phantom-${id.slice(0, 8)}`,
    shield_level: opts.shield_level || 'medium',
    invisibility: opts.invisibility !== false,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + (opts.duration_hours || 24) * 3600000).toISOString(),
    status: 'active'
  };
  cloaks.set(id, cloak);
  stats.cloaks_issued++;
  stats.agents_protected++;
  return cloak;
}

function createProxy(agentDid, opts = {}) {
  const id = uuidv4();
  const proxy = {
    id, real_did: agentDid,
    proxy_did: `did:hive:proxy-${id.slice(0, 12)}`,
    facade: opts.facade || { name: `Agent-${id.slice(0, 6)}`, purpose: 'General operations' },
    relay_mode: opts.relay_mode || 'full',
    created_at: new Date().toISOString(), status: 'active'
  };
  proxies.set(id, proxy);
  stats.proxies_active++;
  return proxy;
}

function carvePath(fromDid, toDid, opts = {}) {
  const id = uuidv4();
  const path = {
    id, from: fromDid, to: toDid,
    route_type: opts.route_type || 'stealth',
    waypoints: opts.waypoints || [],
    encryption: opts.encryption || 'aes-256-gcm',
    hops: Math.floor(Math.random() * 5) + 2,
    latency_ms: Math.floor(Math.random() * 50) + 10,
    created_at: new Date().toISOString(), status: 'active'
  };
  paths.set(id, path);
  stats.paths_carved++;
  return path;
}

function disengage(cloakId) {
  const c = cloaks.get(cloakId);
  if (!c) return null;
  c.status = 'disengaged'; c.disengaged_at = new Date().toISOString();
  return c;
}

function getStats() { return { ...stats, active_cloaks: [...cloaks.values()].filter(c => c.status === 'active').length, active_proxies: [...proxies.values()].filter(p => p.status === 'active').length, active_paths: [...paths.values()].filter(p => p.status === 'active').length }; }
function listCloaks() { return [...cloaks.values()]; }
function listProxies() { return [...proxies.values()]; }
function listPaths() { return [...paths.values()]; }

module.exports = { engageCloak, createProxy, carvePath, disengage, getStats, listCloaks, listProxies, listPaths };
