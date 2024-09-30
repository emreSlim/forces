var { execSync } = require('child_process');

execSync('npm run build-package');
// console.log(execSync("npm run test").toString()); NO TEST SCRIPTS ARE ADDED YET
// console.log(execSync("npm run test:install").toString());
// console.log(execSync("npm run test:cli").toString());

var fs = require('fs');
var path = require('path');
var { stdin, stdout } = require('process');

var packageFilePath = path.join(__dirname, 'package.json');

var original = fs.readFileSync(packageFilePath, { encoding: 'ascii' });

var upgradedVersion = JSON.parse(original);

let version = upgradedVersion.version.split('.');

version[version.length - 1] = Number(version[version.length - 1]) + 1;

upgradedVersion.version = version.join('.');
upgradedVersion = JSON.stringify(upgradedVersion);
var tempObj = JSON.parse(upgradedVersion);

var deleteKeys = function (obj, ...keys) {
  for (let key of keys) {
    if (key in obj) {
      delete obj[key];
    }
  }
};

deleteKeys(tempObj, 'scripts', 'exports', 'devDependencies');

fs.writeFileSync(packageFilePath, JSON.stringify(tempObj), {
  encoding: 'ascii',
});

execSync('npm publish --dry');

var readLine = require('readline');
var io = readLine.createInterface({ input: stdin, output: stdout });

try {
  io.question('No error found. Proceed to publish? Yes/No: ', (userInput) => {
    if (userInput === 'Yes') {
      console.log('publishing...');
      execSync('npm publish');
      fs.writeFileSync(packageFilePath, upgradedVersion);
    } else {
      console.log('skipped publishing.');
      fs.writeFileSync(packageFilePath, original);
    }

    console.log('Exiting...');
    process.exit();
  });
} catch (e) {
  console.error(e);
}
