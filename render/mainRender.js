/**
 * Created by fengmiaosen on 2016/11/27.
 */
// 渲染进程页面
(function (window, document, undefined) {
    const electron = nodeRequire('electron');
    const ipcRenderer = electron.ipcRenderer;
    const os = nodeRequire('os');
    const homeDir = os.homedir();

    const startBtn = document.querySelector('.btn-start');
    const stopBtn = document.querySelector('.btn-stop');
    const saveBtn = document.querySelector('.btn-save');

    const progressBar = document.querySelector('.progress-bar');
    const imageTip = document.querySelector('.image-src');
    const imagePath = document.querySelector('.image-path');

    const image = document.getElementById('bing_image');
    const homeEl = document.getElementById('home_dir');
    const url_panel = document.getElementById('url_panel');
    const path_panel = document.getElementById('path_panel');

    let imageFile = '';
    let fetched = false;

    let bindDomEvent = function () {
        // 渲染页面dom事件监听并派发到主线程
        startBtn.addEventListener('click', function (event) {
            setProcessBar();
            startBtn.classList.add('disabled');
            image.classList.add('image-blur');
            saveBtn.classList.add('disabled');

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
    };

    let bindIpcEvent = function () {
        // 监听主线程事件
        // 抓取图片
        ipcRenderer.on('search-image', function (event, data) {
            fetched = true;
            startBtn.classList.remove('disabled');
            image.classList.remove('image-blur');
            saveBtn.classList.remove('disabled');

            imageTip.innerHTML = data.imageUrl;
            imageFile = data.filePath;
            image.src = data.imageUrl;
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
    };

    let setProcessBar = function () {
        let timer = setInterval(() => {
            progressBar.style.width = (parseInt(progressBar.style.width) + 2) + '%';
            if (fetched) {
                progressBar.style.width = '100%';
                progressBar.innerHTML = '图片下载完成100%';
                clearInterval(timer);
            }
        }, 200);
    };

    // 页面初始化
    homeEl.innerHTML = homeDir;

    bindDomEvent();

    bindIpcEvent();

})(window, document, undefined);
