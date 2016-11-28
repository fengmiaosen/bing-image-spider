/**
 * Created by fengmiaosen on 2016/11/28.
 */
let argv = require('minimist')(process.argv.slice(2));
let packager = require('electron-packager');
let devManifest = require('../package.json');
let config = require('../config');
let path = require('path');

function getElectronVersion () {
    let v = (devManifest.devDependencies || {})['electron']
        ||(devManifest.dependencies || {})['electron']

    if (v) {
        return v.replace(/^\D+/, '')
    } else {
        console.log('No electron version was found in package.json.')
    }
}

let packagerConfig = {
    dir: config.build.outputRoot,
    out: config.build.releasesRoot,
    name: devManifest.name,
    version: getElectronVersion(),
    platform: argv.platform || config.release.platform,
    arch: argv.arch || 'all',
    prune: true,
    overwrite: true,
    ignore: Object.keys({}).map((name) => {
        return '/node_modules/' + name + '($|/)'
    })
};

console.log('package:', packagerConfig);

packager(packagerConfig, (err, appPath) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log('packaged to ' + appPath)
});