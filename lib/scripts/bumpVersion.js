const fs = require('fs');
const path = require('path');

const bumpVersion = () => {
  const indexPath = path.join(__dirname, '../package.json');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const indexJson = JSON.parse(indexContent);
  const version = indexJson.version.split('.');
  version[2] = parseInt(version[2]) + 1;
  indexJson.version = version.join('.');
  fs.writeFileSync(indexPath, JSON.stringify(indexJson, null, 2));
  console.log('Version bumped to', indexJson.version);
};

bumpVersion();
