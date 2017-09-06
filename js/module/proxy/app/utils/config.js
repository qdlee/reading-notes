const fs = require('fs');
const path = require('path');

const configString = fs.readFileSync(
  path.resolve(__dirname, '../../config/config.json')
);
const configs = JSON.parse(configString);

module.exports = configs;
