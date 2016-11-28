/**
 * Created by fengmiaosen on 2016/11/28.
 * 主线程功能
 */
const electron = require('electron');
const {ipcMain, dialog, nativeImage} = electron;
const fs = require('fs');
const os = require('os');
const spider = require('../util/spider');
const QUALITY = 100;
let imagePath = '';

// 保存图片
var showSaveDialog = function (event, mainWindow) {
    const homeDir = os.homedir();
    const options = {
        title: '保存图片',
        buttonLabel: '保存图片',
        defaultPath: homeDir,
        filters: [{
            name: 'Images',
            extensions: ['jpg', 'jpeg', 'png', 'gif']
        }]
    };

    dialog.showSaveDialog(mainWindow, options, function (filename) {
        let image = nativeImage.createFromPath(imagePath);
        let imgData = image.toJPEG(QUALITY);

        if(filename && imgData) {
            fs.writeFile(filename, imgData, "binary", (err) => {
                if(err){
                    event.sender.send('save-image', {
                        error: 1,
                        filename: filename
                    });
                } else {
                    event.sender.send('save-image', {
                        error: 0,
                        filename: filename
                    });
                }
            });
        }
    });
};

// 监听渲染页面进程事件
let setIpc = function (mainWindow) {
    // 下载图片
    ipcMain.on('start-search-image', (event) => {
        spider.start( data => {
            if(data.image) {
                event.sender.send('search-image', data);
                imagePath = data.filePath;
            }
        });
    });

    ipcMain.on('stop-search-image', (event) => {
        event.sender.send('stop-image', '')
    });

    // 保存图片到本地
    ipcMain.on('save-search-image', (event, args) => {
        showSaveDialog(event, mainWindow);
    });
};

exports.setIpc = setIpc;