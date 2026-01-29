/**
 * SAM AI Registry Auto-Generator
 *
 * Scans folder structure and generates:
 * - index.json (registry)
 * - index.html (browsable page)
 * - Per-agent index.html files
 *
 * Conventions:
 * - Numeric prefixes (01-, 02-) are stripped from display names
 * - Folders with agent.json directly = top-level agent
 * - Folders with subfolders containing agent.json = segment
 * - Optional _segment.json for segment metadata (icon, description)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IGNORED = ['.git', 'node_modules', 'scripts', 'shared', 'old module files'];

// Default icons for segments (fallback)
const DEFAULT_ICONS = {
  'sam': '🤖',
  'sales': '💰',
  'marketing': '📢',
  'accounts': '🤝',
  'operations': '⚙️',
  'software-development': '💻',
  'support': '🛟',
  'human-resources': '👥',
  'website': '🌐',
  'research': '🔬',
  'workflow-management': '🔄'
};

/**
 * Strip numeric prefix from folder name (01-sam → sam)
 */
function stripPrefix(name) {
  return name.replace(/^\d+-/, '');
}

/**
 * Convert folder name to display name (software-development → Software Development)
 */
function toDisplayName(name) {
  const stripped = stripPrefix(name);
  return stripped
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get sort key from folder name (01-sam → 01, sales → sales)
 */
function getSortKey(name) {
  const match = name.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 1000; // Non-numbered folders sort last
}

/**
 * Read JSON file safely
 */
function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

/**
 * Scan directory and build registry structure
 */
function scanRegistry() {
  const segments = [];
  const topLevelAgents = [];

  const entries = fs.readdirSync(ROOT)
    .filter(name => {
      const fullPath = path.join(ROOT, name);
      return fs.statSync(fullPath).isDirectory() &&
             !IGNORED.includes(name) &&
             !name.startsWith('.');
    })
    .sort((a, b) => getSortKey(a) - getSortKey(b));

  for (const folderName of entries) {
    const folderPath = path.join(ROOT, folderName);
    const agentJsonPath = path.join(folderPath, 'agent.json');
    const segmentJsonPath = path.join(folderPath, '_segment.json');

    // Check if this is a top-level agent (has agent.json directly)
    if (fs.existsSync(agentJsonPath)) {
      const agentData = readJson(agentJsonPath);
      if (agentData) {
        topLevelAgents.push({
          ...agentData,
          id: agentData.id || stripPrefix(folderName),
          path: `${folderName}/`,
          _folderName: folderName,
          _sortKey: getSortKey(folderName)
        });
      }
      continue;
    }

    // Otherwise, it's a segment - scan for agents inside
    const segmentId = stripPrefix(folderName);
    const segmentMeta = readJson(segmentJsonPath) || {};

    const agents = [];
    const subEntries = fs.readdirSync(folderPath)
      .filter(name => {
        const subPath = path.join(folderPath, name);
        return fs.statSync(subPath).isDirectory() && !name.startsWith('_');
      })
      .sort();

    for (const agentFolder of subEntries) {
      const agentPath = path.join(folderPath, agentFolder, 'agent.json');
      if (fs.existsSync(agentPath)) {
        const agentData = readJson(agentPath);
        if (agentData) {
          agents.push({
            ...agentData,
            id: agentData.id || agentFolder,
            path: `${folderName}/${agentFolder}/`,
            _folderName: agentFolder
          });
        }
      }
    }

    if (agents.length > 0 || fs.existsSync(segmentJsonPath)) {
      segments.push({
        id: segmentId,
        name: segmentMeta.name || toDisplayName(folderName),
        description: segmentMeta.description || '',
        icon: segmentMeta.icon || DEFAULT_ICONS[segmentId] || '📁',
        _folderName: folderName,
        _sortKey: getSortKey(folderName),
        agents
      });
    }
  }

  return { segments, topLevelAgents };
}

/**
 * Generate index.json
 */
function generateIndexJson(data) {
  const { segments, topLevelAgents } = data;

  // Flatten all agents for the agents array
  const allAgents = [
    ...topLevelAgents.map(a => ({
      id: a.id,
      name: a.name || toDisplayName(a._folderName),
      description: a.description || '',
      segment: 'core', // Top-level agents are "core"
      icon: a.icon || '🤖',
      status: a.status || 'active',
      customer_facing: a.customer_facing || false,
      path: a.path,
      use_cases: a.use_cases || [],
      triggers: a.triggers || []
    })),
    ...segments.flatMap(seg =>
      seg.agents.map(a => ({
        id: a.id,
        name: a.name || toDisplayName(a._folderName),
        description: a.description || '',
        segment: seg.id,
        icon: a.icon || '🤖',
        status: a.status || 'active',
        customer_facing: a.customer_facing || false,
        path: a.path,
        use_cases: a.use_cases || [],
        triggers: a.triggers || []
      }))
    )
  ];

  const registry = {
    version: '2.0.0',
    updated: new Date().toISOString().split('T')[0],
    base_url: 'https://ai-sam-ai.github.io/agents',
    description: 'SAM AI Agent Registry - Auto-generated from folder structure',

    segments: [
      // Add "core" for top-level agents if any exist
      ...(topLevelAgents.length > 0 ? [{
        id: 'core',
        name: 'Core',
        description: 'Primary SAM AI agents',
        icon: '⭐'
      }] : []),
      ...segments.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        icon: s.icon
      }))
    ],

    agents: allAgents
  };

  fs.writeFileSync(
    path.join(ROOT, 'index.json'),
    JSON.stringify(registry, null, 2)
  );

  console.log(`Generated index.json with ${allAgents.length} agents`);
  return registry;
}

/**
 * Generate main index.html
 */
function generateIndexHtml(data) {
  const { segments, topLevelAgents } = data;

  const totalAgents = topLevelAgents.length + segments.reduce((sum, s) => sum + s.agents.length, 0);

  // Generate segments HTML
  let segmentsHtml = '';

  // Top-level agents first
  if (topLevelAgents.length > 0) {
    const agentsGrid = topLevelAgents.map(a => {
      const badges = [
        `<span class="badge ${a.status || 'active'}">${a.status || 'active'}</span>`,
        a.customer_facing ? '<span class="badge customer">customer</span>' : ''
      ].filter(Boolean).join('');
      return `      <div class="agent"><a href="${a.path}">${a.id}</a>${badges}</div>`;
    }).join('\n');

    segmentsHtml += `
  <div class="segment">
    <h3>⭐ Core</h3>
    <div class="agent-grid">
${agentsGrid}
    </div>
  </div>
`;
  }

  // Regular segments
  for (const seg of segments) {
    if (seg.agents.length === 0) continue;

    const agentsGrid = seg.agents.map(a => {
      const badges = [
        `<span class="badge ${a.status || 'active'}">${a.status || 'active'}</span>`,
        a.customer_facing ? '<span class="badge customer">customer</span>' : ''
      ].filter(Boolean).join('');
      return `      <div class="agent"><a href="${a.path}">${a.id}</a>${badges}</div>`;
    }).join('\n');

    segmentsHtml += `
  <div class="segment">
    <h3>${seg.icon} ${seg.name}</h3>
    <div class="agent-grid">
${agentsGrid}
    </div>
  </div>
`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SAM AI Agents Registry</title>
  <meta name="description" content="Registry of ${totalAgents}+ specialized AI agents for SAM AI platform">
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; max-width: 1000px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #333; }
    h1 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 0.5rem; }
    h2 { color: #555; margin-top: 2rem; }
    h3 { color: #667eea; margin-top: 1.5rem; }
    a { color: #0066cc; }
    .endpoint { background: #e8f4e8; padding: 0.5rem 1rem; border-radius: 4px; margin: 0.5rem 0; display: inline-block; margin-right: 1rem; }
    .segment { background: #f8f9fa; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
    .segment h3 { margin-top: 0; }
    .agent-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem; }
    .agent { background: white; border: 1px solid #ddd; border-radius: 4px; padding: 0.5rem 1rem; }
    .agent a { text-decoration: none; }
    .agent:hover { border-color: #667eea; }
    .badge { display: inline-block; padding: 0.1rem 0.4rem; border-radius: 3px; font-size: 0.75rem; margin-left: 0.5rem; }
    .active { background: #d4edda; color: #155724; }
    .planned { background: #fff3cd; color: #856404; }
    .customer { background: #cce5ff; color: #004085; }
    .stats { display: flex; gap: 2rem; margin: 1rem 0; }
    .stat { text-align: center; }
    .stat-num { font-size: 2rem; font-weight: bold; color: #667eea; }
    pre { background: #f5f5f5; padding: 1rem; overflow-x: auto; border-radius: 4px; font-size: 0.9rem; }
    footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #ddd; color: #666; font-size: 0.9rem; }
    .auto-generated { background: #e3f2fd; padding: 0.5rem 1rem; border-radius: 4px; margin: 1rem 0; font-size: 0.85rem; }
  </style>
</head>
<body>
  <h1>SAM AI Agents Registry</h1>
  <p>${totalAgents}+ specialized AI agents organized by business segment.</p>

  <div class="auto-generated">
    🤖 <strong>Auto-generated</strong> from folder structure. Last updated: ${new Date().toISOString().split('T')[0]}
  </div>

  <div class="stats">
    <div class="stat"><div class="stat-num">${totalAgents}</div>Agents</div>
    <div class="stat"><div class="stat-num">${segments.length + (topLevelAgents.length > 0 ? 1 : 0)}</div>Segments</div>
  </div>

  <h2>Endpoints</h2>
  <div class="endpoint"><strong>Registry:</strong> <a href="index.json">index.json</a></div>
  <div class="endpoint"><strong>For AI:</strong> <a href="llms.txt">llms.txt</a></div>

  <h2>Agents by Segment</h2>
${segmentsHtml}
  <footer>
    <p><a href="https://github.com/ai-sam-ai/agents">GitHub Repository</a> | <a href="https://sme.ec/documentation">Documentation</a></p>
  </footer>
</body>
</html>
`;

  fs.writeFileSync(path.join(ROOT, 'index.html'), html);
  console.log('Generated index.html');
}

/**
 * Generate per-agent index.html files
 */
function generateAgentIndexFiles(data) {
  const { segments, topLevelAgents } = data;
  let count = 0;

  // Top-level agents
  for (const agent of topLevelAgents) {
    generateAgentIndex(agent, 'Core', agent._folderName);
    count++;
  }

  // Segment agents
  for (const seg of segments) {
    for (const agent of seg.agents) {
      generateAgentIndex(agent, seg.name, `${seg._folderName}/${agent._folderName}`);
      count++;
    }
  }

  console.log(`Generated ${count} agent index.html files`);
}

function generateAgentIndex(agent, segmentName, relativePath) {
  const folderPath = path.join(ROOT, relativePath);
  const files = fs.readdirSync(folderPath)
    .filter(f => fs.statSync(path.join(folderPath, f)).isFile() && f !== 'index.html')
    .sort();

  const filesHtml = files.map(f => `      <li><a href="${f}">${f}</a></li>`).join('\n');
  const name = agent.name || toDisplayName(agent._folderName);
  const desc = agent.description || 'No description available';
  const status = agent.status || 'active';

  // Calculate relative path back to root
  const depth = relativePath.split('/').length;
  const backPath = '../'.repeat(depth);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - SAM AI Agent</title>
  <meta name="description" content="${desc}">
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #333; }
    h1 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 0.5rem; }
    .meta { background: #f8f9fa; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.85rem; margin-right: 0.5rem; }
    .active { background: #d4edda; color: #155724; }
    .planned { background: #fff3cd; color: #856404; }
    .files { background: #e8f4e8; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
    .files ul { margin: 0.5rem 0; padding-left: 1.5rem; }
    a { color: #0066cc; }
    .breadcrumb { color: #666; margin-bottom: 1rem; }
    .breadcrumb a { color: #667eea; }
  </style>
</head>
<body>
  <div class="breadcrumb">
    <a href="${backPath}">Registry</a> / ${segmentName} / ${agent.id || agent._folderName}
  </div>

  <h1>${name}</h1>
  <p>${desc}</p>

  <div class="meta">
    <span class="badge ${status}">${status}</span>
    <strong>Segment:</strong> ${segmentName}
  </div>

  <div class="files">
    <h3>Files</h3>
    <ul>
${filesHtml}
    </ul>
  </div>

  <p><a href="${backPath}">← Back to Registry</a></p>
</body>
</html>
`;

  fs.writeFileSync(path.join(folderPath, 'index.html'), html);
}

// Main execution
console.log('🤖 SAM AI Registry Generator\n');
const data = scanRegistry();
generateIndexJson(data);
generateIndexHtml(data);
generateAgentIndexFiles(data);
console.log('\n✅ Done!');
