const { app, BrowserWindow, screen } = require('electron')
const url = require('url');
const path = require('path');
let mainWindow
function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: width,     // Ancho igual al de la pantalla
        height: height,   // Alto igual al de la pantalla
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/aurogest/browser/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
    // mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}
app.on('ready', createWindow)
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function () {
    if (mainWindow === null) createWindow()
})
