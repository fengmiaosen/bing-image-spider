/**
 * Created by fengmiaosen on 2016/11/27.
 */
const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow} = electron;
const ipcMain = require('./main/ipcMain');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
const winWidth = 1024, winHeight = 768;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        webPreferences: {
            // Electron 的 Renderer 端因为注入了 Node 环境，存在全局函数 require，导致 jQuery 内部环境判断有问题！
            // 如果不需要在网页里面使用 node模块（包括 electron 模块），可以将nodeIntegration 设置为 false。
            // nodeIntegration: false
        }
    });

    // 加载app渲染页面
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.maximize();
    // 打开网页开发工具
    mainWindow.webContents.openDevTools();

    // 监听主进程窗口关闭事件
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    // 注册主进程和渲染进程的交互事件
    ipcMain.setIpc(mainWindow);
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
