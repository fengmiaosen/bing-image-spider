/**
 * Created by fengmiaosen on 2016/11/27.
 */
const electron = require('electron');
const ipc = electron.ipcRenderer;

const startBtn = document.querySelector('.btn-start');
const stopBtn = document.querySelector('.btn-stop');
const saveBtn = document.querySelector('.btn-save');

const imageTip = document.querySelector('.image-src');
const imagePath = document.querySelector('.image-path');
const image = document.getElementById('bing_image');

let imageSrc = '';
let imageFile = '';

// 渲染页面dom事件监听
startBtn.addEventListener('click', function (event) {
    ipc.send('start-search-image');
});
stopBtn.addEventListener('click', function (event) {
    ipc.send('stop-search-image');
});
saveBtn.addEventListener('click', function (event) {
    ipc.send('save-search-image', {
        path: imageFile
    });
});

// 监听主线程事件
// 抓取图片
ipc.on('search-image', function (event, data) {
    imageTip.innerHTML = data.image;
    imagePath.innerHTML = data.filePath;

    imageSrc= data.image;
    imageFile = data.filePath;

    image.src = data.image;
});

// 保存图片
ipc.on('save-image', function (event, filePath) {
    window.alert('image保存成功！', filePath);
});

