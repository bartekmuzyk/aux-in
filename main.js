const {app, BrowserWindow, Menu, Tray} = require("electron");

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        resizable: false,
        // show: false,
        icon: "assets/icon.png"
    });
    win.removeMenu();

    if (process.env.DEVTOOLS === "1") {
        win.webContents.openDevTools({mode: "detach"});
    }

    win.loadFile("index.html");
}

app.whenReady().then(() => {
    createWindow();

    const tray = new Tray("assets/icon.png");
    const contextMenu = Menu.buildFromTemplate([
        {
            icon: "assets/icon.png",
            label: "Aux In",
            enabled: false
        },
        {
            label: "Change input device",
            sublabel: "hello"
        },
        {type: "separator"},
        {
            icon: "",
            label: "Włącz"
        }
    ]);
    tray.setToolTip("Aux In");
    tray.setContextMenu(contextMenu);
});

app.on("window-all-closed", () => {

});
