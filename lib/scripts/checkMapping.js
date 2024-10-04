const fs = require('fs');
const path = require('path');

const getAssetsFiles = () => {
  const assetsDir = path.join(__dirname, '../../assets');
  return fs.readdirSync(assetsDir).filter((file) => file.endsWith('.png'));
};

const getMapping = () => {
  const indexPath = path.join(__dirname, '../../assets/index.json');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const indexJson = JSON.parse(indexContent);
  return [...new Set(Object.keys(indexJson).map((key) => indexJson[key].icon))];
};

const checkMapping = () => {
  const pngFiles = getAssetsFiles();
  const mappedIcons = getMapping();

  const unusedFiles = pngFiles.filter((file) => !mappedIcons.includes(file));

  if (unusedFiles.length > 0) {
    console.log('Unused PNG files:');
    unusedFiles.forEach((file) => console.log(file));
  } else {
    console.log('All PNG files are used in index.json.');
  }
};

checkMapping();

module.exports = checkMapping;
