/**
 * Created by fengmiaosen on 2016/11/27.
 */
const electron = require('electron');
const path = require('path');
const url = require('url');
const spider = require('./util/spider');

const {app, BrowserWindow} = electron;
const ipc = electron.ipcMain;
const dialog = electron.dialog;

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

// 下载图片
ipc.on('start-search-image', function (event) {
    spider.start( data => {
        if(data.image) {
            event.sender.send('search-image', data)
        }
    });
});

// 保存图片到本地
ipc.on('save-search-image', function (event, args) {
    const options = {
        title: '保存图片',
        // 默认保存位置
        // defaultPath: args.path,
        filters: [
            {name: 'Images', extensions: ['jpg', 'png', 'gif']}
        ]
    };

    dialog.showSaveDialog(options, function (filename) {
        event.sender.send('save-image', filename)
    })
});