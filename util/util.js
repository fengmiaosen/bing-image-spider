/**
 * Created by fengmiaosen on 2016/11/26.
 */
let superagent = require('superagent');
let cheerio = require('cheerio');
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
            decodeEntities: true
        });
        let scripts = $('script');
        let bgDiv = $('#bgDiv');

        console.log('script count', scripts.length);

        scripts.map((index, script) => {

            let content = $(script).text();
            const reg = /g_img\s*=\s*\{\s*url:\s*"((http:)?\/\/[\w\d\.\/_-]+)"/i;

            if(content.search(reg) > 0){
                let img = reg.exec(content);
                let imgSrc = '';

                //不带http协议头的为https类型，需要手动添加
                if(img[1] && img[1].search(/http:/i) < 0) {
                    imgSrc = 'http:' + img[1];
                }

                console.log('img url:', imgSrc);
            }

        });

    });