/**
 * Created by fengmiaosen on 2016/11/26.
 */

const reg = /\bg_img=\{\s*url:\s*"((http:)?\/\/[\w\d\.\/_-]+)",\s*id:\s*'bgDiv'/i;

function get(content) {
    let imgSrc = '';

    if(content.search(reg) > 0){
        let img = reg.exec(content);

        console.log('img:', img);

        if(img !== null){
            //不带http协议头的为https类型资源，需要手动添加
            imgSrc = img[2] ? img[1] : 'http:' + img[1];
        } else {
            console.log('背景大图地址url为空!')
        }
    } else {
        console.log('没有匹配到背景大图url!')
    }

    return imgSrc;
}

module.exports = {
    get
};