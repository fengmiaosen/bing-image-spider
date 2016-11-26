
let thenjs = require('thenjs');
let phantom = require('phantom');
let parse_content = require('./util/parse_content');
let fetchImg = require('./util/fetch_img');
let _ph, _page, _outObj;

const cnUrl = 'http://cn.bing.com/';
const globalUrl = 'http://global.bing.com/';
const urlList = [cnUrl, globalUrl];
let url = cnUrl;


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
    // 网页内容解析匹配背景大图
    let imgSrc = parse_content.get(content);

    // 请求图片数据
    fetchImg.get(imgSrc);

    _page.close();
    _ph.exit();
}).catch(e => console.log('error', e));
