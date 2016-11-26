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

module.exports = {
    get(imgSrc) {
        fetch(imgSrc).then(res => {
            let extType = path.extname(imgSrc);
            let time = moment().format("YYYY-MM-DD-HH-mm");
            let fileName = filePrefix + '_' + time + extType;
            let filePath = path.join(path.dirname(path.basename(__dirname)), temp, fileName);

            console.log('path:', filePath);

            let dest = fs.createWriteStream(filePath);
            res.body.pipe(dest);
        });
    }
};