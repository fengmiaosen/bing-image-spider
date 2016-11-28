/**
 * Created by fengmiaosen on 2016/11/26.
 */
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const parse_content = require('./parse_content');

const source = 'cn';
const filePrefix = source + '_bing';
const temp = 'tmp';
const pathObj = path.parse(__dirname);

function get(content, callback) {
    // 网页内容解析匹配背景大图url
    const imgSrc = parse_content.get(content);

    if (!imgSrc) {
        return;
    }

    fetch(imgSrc).then(res => {
        let extType = path.extname(imgSrc);
        let time = moment().format("YYYY-MM-DD-HH");
        let fileName = filePrefix + '_' + time + extType;
        let filePath = path.join(pathObj.dir, temp, fileName);

        // console.log('path parse:', path.parse(__dirname));
        // 写入到临时文件夹
        let dest = fs.createWriteStream(filePath);
        res.body.pipe(dest);

        //
        callback && callback({
            imageUrl: imgSrc,
            filePath: filePath
        });
    }).then(res => {

    }).catch(err => {
        console.log(err);
    });
}

module.exports = {
    get
};