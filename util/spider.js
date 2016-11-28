const phantom = require('phantom');
const fetchImg = require('./fetch_img');
const cnUrl = 'http://cn.bing.com/';
const globalUrl = 'http://global.bing.com/';
const urlList = [cnUrl, globalUrl];
const url = cnUrl;

const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36';

let _ph, _page, _outObj;

function start(callback) {
    let phantomInst = phantom.create();

    phantomInst.then(ph => {
        _ph = ph;
        return _ph.createPage();
    }).then(page => {
        _page = page;
        page.setting('userAgent', ua);
        return _page.open(url);
    }).then(status => {
        // console.log('status:', status);
        return _page.property('content')
    }).then(content => {
        // 匹配并请求图片数据
        fetchImg.get(content, callback);

        // 关闭页面进程
        stop();
    }).catch(e => {
        console.log('error', e);
        stop();
    });
}

function stop() {
    _page.close();
    _ph.exit();
}

module.exports = {
    start
};
