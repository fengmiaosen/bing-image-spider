/**
 * Created by fengmiaosen on 2016/11/27.
 */
const electron = nodeRequire('electron');
const ipcRenderer = electron.ipcRenderer;
const os = nodeRequire('os');
const homeDir = os.homedir();

(function(window, document, undefined){
    const startBtn = document.querySelector('.btn-start');
    const stopBtn = document.querySelector('.btn-stop');
    const saveBtn = document.querySelector('.btn-save');

    const imageTip = document.querySelector('.image-src');
    const imagePath = document.querySelector('.image-path');

    const image = document.getElementById('bing_image');
    const homeEl = document.getElementById('home_dir');
    const url_panel = document.getElementById('url_panel');
    const path_panel = document.getElementById('path_panel');

    let imageSrc = '';
    let imageFile = '';

    homeEl.innerHTML = homeDir;

    // 渲染页面dom事件监听并派发到主线程
    startBtn.addEventListener('click', function (event) {
        startBtn.classList.add('disabled');
        image.classList.add('image-blur');

        ipcRenderer.send('start-search-image');
    });
    stopBtn.addEventListener('click', function (event) {
        ipcRenderer.send('stop-search-image');
    });
    saveBtn.addEventListener('click', function (event) {
        saveBtn.classList.add('disabled');

        ipcRenderer.send('save-search-image', {
            path: imageFile
        });
    });

    // 监听主线程事件
    // 抓取图片
    ipcRenderer.on('search-image', function (event, data) {
        startBtn.classList.remove('disabled');
        image.classList.remove('image-blur');

        imageTip.innerHTML = data.image;
        imageSrc = data.image;
        imageFile = data.filePath;
        image.src = data.image;
    });

    // 关闭窗口
    ipcRenderer.on('stop-image', function (event, args) {
        console.log('关闭窗口！');
    });

    // 保存图片
    ipcRenderer.on('save-image', function (event, args) {
        saveBtn.classList.remove('disabled');

        if (args.error) {
            window.alert('image保存失败！')
        } else {
            imagePath.innerHTML = args.filename;
            window.alert('image保存成功！' + args.filename);
        }
    });
})(window, document, undefined);
