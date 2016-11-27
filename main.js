/**
 * Created by fengmiaosen on 2016/11/27.
 */
const electron = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');
const spider = require('./util/spider');

const {app, BrowserWindow} = electron;
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
const nativeImage = electron.nativeImage;

const os = require('os');
const homeDir = os.homedir();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
const winWidth = 1024, winHeight = 768;

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: winWidth,
        height: winHeight
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // 打开网页开发工具
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// 监听渲染页面进程事件
let imagePath = '';

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
    spider.stop();
    event.sender.send('stop-image', '')
});

// 保存图片到本地
ipcMain.on('save-search-image', (event, args) => {
    const options = {
        title: '保存图片',
        buttonLabel: '保存图片',
        // 默认保存位置
        defaultPath: homeDir,
        filters: [
            {name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif']}
        ]
    };

    dialog.showSaveDialog(mainWindow, options, function (filename) {
        let image = nativeImage.createFromPath(imagePath);
        let imgData = image.toJPEG(90);

        fs.writeFile(filename, imgData, "binary", (err) => {
            if(err){
                console.log("down fail");
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

    })
});