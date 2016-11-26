/**
 * Created by fengmiaosen on 2016/11/26.
 */
let fetch = require('node-fetch');
let fs = require('fs');
let path = require('path');
let moment = require('moment');

const source = 'cn';
const filePrefix = 'bing';

module.exports = {
    get(imgSrc) {
        fetch(imgSrc).then(res => {
            let extType = path.extname(imgSrc);
            let time = moment().format("YYYY-MM-DD-HH-mm");
            let fileName = source + '_' + filePrefix + '_' + time + extType;
            let filePath = path.join(path.basename(__dirname), fileName);

            console.log('path:', filePath);

            let dest = fs.createWriteStream(filePath);
            res.body.pipe(dest);
        });
    }
};