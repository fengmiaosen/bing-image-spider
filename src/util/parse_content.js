/**
 * Created by fengmiaosen on 2016/11/26.
 */

const reg = /\bg_img=\{\s*url:\s*"((http:)?\/\/[\w\d\.\/_-]+)",\s*id:\s*'bgDiv'/i;

function get(content) {

    if(content.search(reg) > 0){
        let img = reg.exec(content);
        let imgSrc = '';

        if(img[1]){
            //不带http协议头的为https类型资源，需要手动添加
            if(img[1].search(/http:/i) < 0){
                imgSrc = 'http:' + img[1];
            } else {
                imgSrc = img[1];
            }
        } else {
            console.log('背景大图地址url为空!')
        }

        // console.log('img url:', imgSrc);
        return imgSrc;
    } else {
        console.log('没有匹配到背景大图url!')
    }
}

module.exports = {
    get
};