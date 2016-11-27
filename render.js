/**
 * Created by fengmiaosen on 2016/11/27.
 */
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const os = require('os');
const homeDir = os.homedir();

const startBtn = document.querySelector('.btn-start');
const stopBtn = document.querySelector('.btn-stop');
const saveBtn = document.querySelector('.btn-save');

const imageTip = document.querySelector('.image-src');
const imagePath = document.querySelector('.image-path');
const image = document.getElementById('bing_image');
const homeEl = document.getElementById('home_dir');

let imageSrc = '';
let imageFile = '';

homeEl.innerHTML = homeDir;

// 渲染页面dom事件监听
startBtn.addEventListener('click', function (event) {
    ipcRenderer.send('start-search-image');
});
stopBtn.addEventListener('click', function (event) {
    ipcRenderer.send('stop-search-image');
});
saveBtn.addEventListener('click', function (event) {
    ipcRenderer.send('save-search-image', {
        path: imageFile
    });
});

// 监听主线程事件
// 抓取图片
ipcRenderer.on('search-image', function (event, data) {
    imageTip.innerHTML = data.image;

    imageSrc= data.image;
    imageFile = data.filePath;

    image.src = data.image;
});

// 停止抓取
ipcRenderer.on('stop-image', function (event, args) {
    window.alert('停止抓取！');
});

// 保存图片
ipcRenderer.on('save-image', function (event, args) {
    if(args.error){
        window.alert('image保存失败！')
    } else {
        imagePath.innerHTML = args.filename;
        window.alert('image保存成功！' + args.filename);
    }
});

