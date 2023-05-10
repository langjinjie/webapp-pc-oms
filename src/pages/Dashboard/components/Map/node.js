const geoJson = require('./china2.json');
const fs = require('fs');
const mapjosn = geoJson.features.map((item) => ({ name: item.properties.name, cp: item.properties.cp, id: item.id }));
const maymaps = {};
mapjosn.forEach((item) => {
  maymaps[item.name] = item.cp;
});

const data = JSON.stringify(mapjosn);
fs.writeFileSync('./maps.json', data, 'utf-8', (err) => {
  console.log(err);
});
