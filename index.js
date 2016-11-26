
let parse_content = require('./util/parse_content');
let phantom = require('phantom');
let fetch = require('node-fetch');
let fileType = require('file-type');
let fs = require('fs');

let _ph, _page, _outObj;
const url = 'http://cn.bing.com/';

phantom.create().then(ph => {
    _ph = ph;
    return _ph.createPage();
}).then(page => {
    _page = page;
    return _page.open(url);
}).then(status => {
    console.log('status:', status);
    return _page.property('content')
}).then(content => {

    if(!content){
        console.log('content empty!')
    }

    // 网页内容解析匹配背景大图
    let imgSrc = parse_content.get(content);

    // 请求图片数据
    fetch(imgSrc).then(function (res) {
        let dest = fs.createWriteStream('./bing.jpg');

        res.body.pipe(dest);
    });

    _page.close();
    _ph.exit();
}).catch(e => console.log('error', e));
