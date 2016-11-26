/**
 * Created by fengmiaosen on 2016/11/26.
 */

const reg = /g_img=\{\s*url:\s*"((http:)?\/\/[\w\d\.\/_-]+)"/i;

module.exports = {
    get(content){

        if(content.search(reg) > 0){
            let img = reg.exec(content);
            let imgSrc = '';

            //不带http协议头的为https类型，需要手动添加
            if(img[1] && img[1].search(/http:/i) < 0) {
                imgSrc = 'http:' + img[1];
            }

            console.log('img url:', imgSrc);

            return imgSrc;
        }
    }
};