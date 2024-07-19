import { app, BrowserWindow, protocol } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createWindow } from "../main/window.js"
import "../main/menu.js"
import { ipcSetup } from "../main/electronIPC.js"
import path from 'path'

let mainWindow;

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('educoder-electron', process.execPath, [path.resolve(process.argv[1])]);
    }
} else {
    app.setAsDefaultProtocolClient('educoder-electron');
}

protocol.registerSchemesAsPrivileged([
    {
        scheme: 'media',
        privileges: {
            secure: true,
            supportFetchAPI: true,
            bypassCSP: true
        }
    }
]);

app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    protocol.handle('media', (req) => {
        const pathToMedia = new URL(req.url).pathname;
        return net.fetch(`file://${pathToMedia}`);
    });

    ipcSetup();
    mainWindow = createWindow();

    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow(); })
})

// Windows
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (_event, argv, _workingDirectory) => {
        if (mainWindow) {
            const deepLinkingUrl = argv.find((arg) => arg.startsWith('educoder-electron://'));
            const token = deepLinkingUrl?.substring(20).slice(0, -1);

            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();

            mainWindow.webContents.send('sendToken', token);
        }
    })
}
// Unix machines - Linux and Mac
app.on('open-url', (event, url) => {
    if (mainWindow) {
        const token = url?.substring(20);

        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();

        mainWindow.webContents.send('sendToken', token);
    }
})

app.on('window-all-closed', () => { if (process.platform !== 'darwin') { app.quit(); } })
