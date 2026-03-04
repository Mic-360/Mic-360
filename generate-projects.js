const fs = require('fs');

const GITHUB_USERNAME = 'Mic-360';
const PROFILE_REPO = `${GITHUB_USERNAME}/${GITHUB_USERNAME}`;

// ─── Language → Devicon color mapping for shields.io badges ───
const LANG_COLORS = {
  JavaScript: 'F7DF1E',
  TypeScript: '3178C6',
  Dart: '0175C2',
  Python: '3776AB',
  Rust: 'DEA584',
  Go: '00ADD8',
  'C++': '00599C',
  Java: 'ED8B00',
  HTML: 'E34F26',
  CSS: '1572B6',
  Svelte: 'FF3E00',
  PowerShell: '5391FE',
  Makefile: '427819',
  Shell: '89E051',
  Ruby: 'CC342D',
  Kotlin: '7F52FF',
  Swift: 'F05138',
  C: 'A8B9CC',
};

const LANG_LOGOS = {
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  Dart: 'dart',
  Python: 'python',
  Rust: 'rust',
  Go: 'go',
  'C++': 'cplusplus',
  Java: 'openjdk',
  HTML: 'html5',
  CSS: 'css3',
  Svelte: 'svelte',
  PowerShell: 'powershell',
  Makefile: 'cmake',
  Shell: 'gnubash',
  Ruby: 'ruby',
  Kotlin: 'kotlin',
  Swift: 'swift',
  C: 'c',
};



/**
 * Create a shields.io badge URL
 */
function badge(label, message, color, logo = '') {
  // Shields.io uses single hyphen as separator; literal hyphens must be doubled
  const escape = (s) => encodeURIComponent(s).replace(/-/g, '--');
  const encodedLabel = escape(label);
  const encodedMsg = escape(String(message));
  let url = `https://img.shields.io/badge/${encodedLabel}-${encodedMsg}-${color}?style=flat-square`;
  if (logo) {
    url += `&logo=${logo}&logoColor=white`;
  }
  return url;
}

const COLUMNS = 2;

/**
 * Generate a single project card as a <td> cell
 */
function generateProjectCell(repo) {
  const name = repo.name;
  const description = repo.description || '_No description provided._';
  const url = repo.html_url;
  const language = repo.language || 'Unknown';
  const stars = repo.stargazers_count;
  const forks = repo.forks_count;
  const topics = repo.topics || [];

  const homepage = repo.homepage || '';
  const license = repo.license ? repo.license.spdx_id : '';

  const langColor = LANG_COLORS[language] || '555555';
  const langLogo = LANG_LOGOS[language] || '';

  let md = '';

  md += `<td width="${Math.floor(100 / COLUMNS)}%" valign="top">\n\n`;

  // Project name as a linked heading
  md += `### [${name}](${url})\n\n`;
  md += `${description}\n\n`;

  // Badges row
  const badges = [];
  badges.push(`![${language}](${badge('', language, langColor, langLogo)})`);
  if (stars > 0) {
    badges.push(`![Stars](${badge('⭐', stars, '000', '')})`);
  }
  if (forks > 0) {
    badges.push(`![Forks](${badge('🔱', forks, '000', '')})`);
  }
  if (license && license !== 'NOASSERTION') {
    badges.push(`![License](${badge('📜', license, '000', '')})`);
  }


  md += badges.join(' ') + '\n\n';

  // Topic tags
  if (topics.length > 0) {
    md += topics.slice(0, 5).map(t => `\`${t}\``).join(' ') + '\n\n';
  }

  // Action links
  const links = [`[📂 Source](${url})`];
  if (homepage) {
    links.push(`[🌐 Demo](${homepage})`);
  }
  md += links.join(' · ') + '\n\n';

  md += `</td>\n`;

  return md;
}

/**
 * Generate the full projects section, sorted by creation date (newest first)
 */
function generateProjectsSection(repos) {
  console.log('Processing repositories...');

  // Filter out forks, private repos, and the profile repo itself
  const filteredRepos = repos.filter(repo =>
    !repo.fork &&
    repo.full_name !== PROFILE_REPO &&
    !repo.private
  );

  // Sort by created_at descending (newest first)
  filteredRepos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  console.log(`Found ${filteredRepos.length} public, non-fork repositories.`);

  // Build the markdown
  let md = '';

  md += `## 🚀 Projects\n\n`;
  md += `> Sorted by creation date — newest first.\n\n`;

  md += `<table>\n`;

  for (let i = 0; i < filteredRepos.length; i += COLUMNS) {
    md += `<tr>\n`;
    for (let j = 0; j < COLUMNS; j++) {
      if (i + j < filteredRepos.length) {
        md += generateProjectCell(filteredRepos[i + j]);
      } else {
        // Empty cell to keep the grid aligned
        md += `<td width="${Math.floor(100 / COLUMNS)}%"></td>\n`;
      }
    }
    md += `</tr>\n`;
  }

  md += `</table>\n\n`;

  return md;
}

/**
 * Replace the projects section in README.md
 */
function updateReadme(reposData) {
  try {
    const projectsSection = generateProjectsSection(reposData);

    let readme = fs.readFileSync('README.md', 'utf8');

    // Remove any existing Projects section
    const projectsMarker = /## 🚀 Projects[\s\S]*?(?=<!-- Languages and Tools Section -->|$)/;
    readme = readme.replace(projectsMarker, '');

    // Insert before Languages and Tools section
    let insertPosition = readme.indexOf('<!-- Languages and Tools Section -->');
    if (insertPosition === -1) {
      insertPosition = readme.indexOf('<h2 align="center">🫤 Languages and Tools</h2>');
    }

    if (insertPosition !== -1) {
      readme = readme.slice(0, insertPosition) + projectsSection + '\n' + readme.slice(insertPosition);
    } else {
      readme += '\n\n' + projectsSection;
    }

    fs.writeFileSync('README.md', readme);
    console.log('README.md updated successfully!');
  } catch (error) {
    console.error('Error updating README:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  if (!fs.existsSync('repos-data.json')) {
    console.error('repos-data.json not found. Please create it first.');
    process.exit(1);
  }

  const reposData = JSON.parse(fs.readFileSync('repos-data.json', 'utf8'));
  updateReadme(reposData);
}

module.exports = { updateReadme, generateProjectsSection };
