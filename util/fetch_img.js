/**
 * Created by fengmiaosen on 2016/11/26.
 */
let fetch = require('node-fetch');
let fs = require('fs');
let path = require('path');
let moment = require('moment');

const source = 'cn';
const filePrefix = source + '_bing';
const temp = 'tmp';
const pathObj = path.parse(__dirname);

module.exports = {
    get(imgSrc) {
        fetch(imgSrc).then(res => {
            let extType = path.extname(imgSrc);
            let time = moment().format("YYYY-MM-DD-HH");
            let fileName = filePrefix + '_' + time + extType;
            let filePath = path.join(pathObj.dir, temp, fileName);

            console.log('path parse:', path.parse(__dirname));
            console.log('path:', filePath);

            let dest = fs.createWriteStream(filePath);
            res.body.pipe(dest);
        });
    }
};