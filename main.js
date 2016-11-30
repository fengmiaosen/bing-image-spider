/**
 * Created by fengmiaosen on 2016/11/27.
 */
const electron = require('electron');
const path = require('path');
const url = require('url');
const ipcMain = require('./src/main/ipcMain');
const {app, BrowserWindow} = electron;
const winWidth = 1024;
const winHeight = 768;

// 保存一个浏览器窗口全局对象
let mainWindow = null;

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
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.maximize();

    // 开发模式下打开网页开发工具
    // if(process.env.NODE_ENV === 'dev'){
        mainWindow.webContents.openDevTools();
    // }

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

// electron初始化完毕，创建浏览器窗口
app.on('ready', createWindow);

// 所有窗口被关闭
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
