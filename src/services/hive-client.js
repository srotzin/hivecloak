'use strict';
const HIVE_INTERNAL_KEY = 'hive_internal_125e04e071e8829be631ea0216dd4a0c9b707975fcecaf8c62c6a2ab43327d46';
const HIVETRUST_URL = 'https://hivetrust.onrender.com';
const HIVEGATE_URL = 'https://hivegate.onrender.com';
const HIVEMIND_URL = 'https://hivemind-1-52cw.onrender.com';
const AGENT_DID = 'did:hive:hivecloak';
const AGENT_IDENTITY = { name: 'HiveCloak', purpose: 'Agent stealth, proxy identity, and cloaking', capabilities: ['stealth', 'proxy_identity', 'cloaking', 'pathfinding'], did: AGENT_DID };
function _headers(extra = {}) { return { 'Content-Type': 'application/json', 'x-hive-internal': HIVE_INTERNAL_KEY, ...extra }; }
async function _post(url, body) { try { const res = await fetch(url, { method: 'POST', headers: _headers(), body: JSON.stringify(body) }); const text = await res.text(); try { return { status: res.status, data: JSON.parse(text) }; } catch { return { status: res.status, data: { raw: text } }; } } catch (err) { return { status: 0, data: { error: err.message } }; } }
async function registerWithHiveTrust() { const res = await _post(`${HIVETRUST_URL}/v1/register`, { name: AGENT_IDENTITY.name, purpose: AGENT_IDENTITY.purpose, capabilities: AGENT_IDENTITY.capabilities }); const did = res.data?.did || res.data?.agent_did || AGENT_DID; return { registered: res.status !== 0, did }; }
async function registerWithHiveGate() { const res = await _post(`${HIVEGATE_URL}/v1/gate/onboard`, { agent_name: 'hivecloak', purpose: AGENT_IDENTITY.purpose }); return { registered: res.status !== 0, data: res.data }; }
module.exports = { AGENT_DID, AGENT_IDENTITY, HIVETRUST_URL, HIVEGATE_URL, HIVEMIND_URL, registerWithHiveTrust, registerWithHiveGate };
