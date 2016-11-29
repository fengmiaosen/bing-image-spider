/**
 * Created by fengmiaosen on 2016/11/28.
 */
const argvs = process.argv.slice(2);
const argv = require('minimist')(argvs);
const packager = require('electron-packager');
const devManifest = require('../package.json');
const config = require('../config');
const path = require('path');

function getElectronVersion () {
    let v = (devManifest.devDependencies || {})['electron']
        ||(devManifest.dependencies || {})['electron']

    if (v) {
        return v.replace(/^\D+/, '')
    } else {
        console.log('No electron version was found in package.json.')
    }
}

const pkgConfig = {
    dir: config.build.outputRoot,
    out: config.build.releasesRoot,
    name: devManifest.name,
    version: getElectronVersion(),
    platform: argv.platform || config.release.platform,
    arch: argv.arch || 'x64',
    asar: true,
    // prune: true,
    overwrite: true,
    ignore:/\b(node_modules|icons)\b/i
};

console.log('package:', pkgConfig);

packager(pkgConfig, (err, appPath) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log('packaged to ' + appPath)
});