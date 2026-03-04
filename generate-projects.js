const fs = require('fs');

const GITHUB_USERNAME = 'Mic-360';
const PROFILE_REPO = `${GITHUB_USERNAME}/${GITHUB_USERNAME}`;

function categorizeProject(repo) {
  const name = repo.name.toLowerCase();
  const description = (repo.description || '').toLowerCase();
  const topics = repo.topics || [];

  if (topics.includes('browser-extension') || topics.includes('vscode-extension') || name.includes('extension') || name.includes('auto-copilot')) {
    return 'Developer Tools';
  }

  if (name.includes('device_') || name.includes('vendor_') || topics.includes('android')) {
    return 'Android Development';
  }

  if (topics.includes('nextjs') || topics.includes('react') || topics.includes('svelte') ||
      topics.includes('typescript') || topics.includes('template') || name.includes('scalable')) {
    return 'Web Applications';
  }

  if (topics.includes('flutter') || topics.includes('dart') || repo.language === 'Dart') {
    return 'Mobile Applications';
  }

  if (topics.includes('iot') || topics.includes('machine-learning') || topics.includes('ai') || name.includes('predictive')) {
    return 'IoT & AI Projects';
  }

  if (topics.includes('hacktoberfest') || topics.includes('bootcamp') || name.includes('bootcamp')) {
    return 'Learning & Open Source';
  }

  return 'Other Projects';
}

function generateProjectMarkdown(repo) {
  const name = repo.name;
  const description = repo.description || 'No description available';
  const url = repo.html_url;
  const language = repo.language || 'Unknown';
  const stars = repo.stargazers_count;
  const topics = repo.topics || [];

  let markdown = `### ${name}\n`;
  markdown += `${description}\n\n`;
  markdown += `**Tech:** ${language}`;

  if (topics.length > 0) {
    markdown += ` | ${topics.slice(0, 3).join(', ')}`;
  }

  markdown += `  \n`;
  markdown += `**Repo:** ${url}`;

  if (stars > 0) {
    markdown += ` | ⭐ ${stars}`;
  }

  return markdown;
}

function generateProjectsSection(repos) {
  console.log('Processing repositories...');

  const filteredRepos = repos.filter(repo =>
    !repo.fork &&
    repo.full_name !== PROFILE_REPO &&
    !repo.private
  );

  filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);

  const categorized = {};
  filteredRepos.forEach(repo => {
    const category = categorizeProject(repo);
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(repo);
  });

  const categoryOrder = [
    'Developer Tools',
    'Web Applications',
    'Mobile Applications',
    'IoT & AI Projects',
    'Learning & Open Source',
    'Android Development',
    'Other Projects'
  ];

  let markdown = '## 🚀 Projects\n\n';

  categoryOrder.forEach(category => {
    if (categorized[category] && categorized[category].length > 0) {
      markdown += `#### ${category}\n\n`;
      categorized[category].forEach(repo => {
        markdown += generateProjectMarkdown(repo) + '\n\n';
      });
    }
  });

  return markdown;
}

function updateReadme(reposData) {
  try {
    const projectsSection = generateProjectsSection(reposData);

    let readme = fs.readFileSync('README.md', 'utf8');

    // First, remove any existing Projects section
    const projectsMarker = /## 🚀 Projects[\s\S]*?(?=<h2|$)/;
    readme = readme.replace(projectsMarker, '');

    // Then insert before Languages and Tools section using a stable marker
    let insertPosition = readme.indexOf('<!-- Languages and Tools Section -->');
    if (insertPosition === -1) {
      // Fallback for older READMEs that still use the explicit <h2> heading
      insertPosition = readme.indexOf('<h2 align="center">🫤 Languages and Tools</h2>');
    }

    if (insertPosition !== -1) {
      readme = readme.slice(0, insertPosition) + projectsSection + '\n' + readme.slice(insertPosition);
    } else {
      // If no marker or heading is found, append the Projects section at the end
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
