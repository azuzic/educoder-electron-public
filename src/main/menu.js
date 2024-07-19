import { app, Menu } from 'electron'
import { shell } from 'electron'

const isMac = process.platform === 'darwin'

const template = [
    // { role: 'appMenu' }
    ...(isMac
            ? [{
                label: app.name,
                submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
                ]
            }]
        : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    await shell.openExternal('https://fipu-educoder.netlify.app')
                }
            },
            { type: 'separator' },
            {
                label: 'Documentation',
                click: async () => {
                    console.log("yay")
                }
            },
            {
                label: 'Tips and tricks',
                click: async () => {
                    console.log("yay")
                }
            },
            { type: 'separator' },
            {
                label: 'Show release notes',
                click: async () => {
                    console.log("yay")
                }
            },
            {
                label: 'Report issue',
                click: async () => {
                    console.log("yay")
                }
            },
            { type: 'separator' },
            { role: 'about' },
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
