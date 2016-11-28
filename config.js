/**
 * Created by fengmiaosen on 2016/11/28.
 */
let path = require('path');

module.exports = {
    build: {
        // The directory which will contained packaged releases and installers
        // for various operation systems.
        releasesRoot: path.resolve(__dirname, 'releases'),

        // The target directory for your app's compiled assets. Must be an absolute path.
        // This is the directory which will contain a runnable electron app.
        outputRoot: path.resolve(__dirname, 'dist')
    },
    release: {
        // The Electron version to use for packaged releases. If blank, it defaults
        // to the version of electron-prebuilt in your development package.json.
        //
        // electronVersion: '0.37.2',

        // The target platforms for packaged releases. For options, see
        // https://github.com/electron-userland/electron-packager
        platform: 'all'
    }
};
