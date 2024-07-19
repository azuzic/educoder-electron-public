import { shell, BrowserWindow, nativeImage } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

function createWindow() {
    const mainWindow = new BrowserWindow({
        icon: join(__dirname, '../renderer/src/assets/icon.png'),
        width: 1800,
        height: 900,
        show: true,
        autoHideMenuBar: !(is.dev && process.env['ELECTRON_RENDERER_URL']),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
        },
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();

        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            mainWindow.webContents.openDevTools();
        }

        mainWindow.webContents.on('did-get-redirect-request', function(e, oldURL, newURL, isMainFrame, httpResponseCode, requestMethod, refeerrer, header) {
            if (isMainFrame) {
                setTimeout(() => win.loadURL(newURL), 100);
                e.preventDefault();
            }
        });
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    return mainWindow;
}

export { createWindow }
