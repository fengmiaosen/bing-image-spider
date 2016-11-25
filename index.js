
let superagent = require('superagent');
let cheerio = require('cheerio');
let thenjs = require('thenjs');
let app = require('express');

console.log('bing搜索首页大图爬虫开始运行...');

superagent
    .get('http://cn.bing.com/')
    .end((err, res) => {

        if(!res.text){
            console.error('请求失败未返回数据');
        }

        // 获取爬虫页面内容
        let $ = cheerio.load(res.text, {
            decodeEntities: false
        });
        let headStyles = $('head style');
        let bgDiv = $('#bgDiv');

        headStyles.map((index, style) => {

            let styleText = $(style).text();

            // console.log('head style=========' + index,styleText);
            console.log('\n');

            if(/\#bgDiv\{([\s\S]+)\}/gi.test(styleText)) {
                console.log('bgDiv style>>>>>>>>', /\#bgDiv\{([\s\S]+)\}/gi.exec(styleText)[1]);
                return;
            }

        });

        // console.log('img url', bgDiv);
    });
