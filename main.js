const {app, BrowserWindow, Menu, Tray, nativeImage, ipcMain} = require("electron");
const path = require("path");

app.setName("Aux In");

/** @type {Electron.CrossProcessExports.BrowserWindow} */
let win;

function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 600,
        resizable: false,
        show: false,
        icon: "assets/icon.png",
        backgroundMaterial: "mica",
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        darkTheme: true,
        minimizable: false
    });
    win.removeMenu();

    win.on("close", event => {
        event.preventDefault();
        win.hide();
    });

    if (process.env.DEVTOOLS === "1") {
        win.webContents.openDevTools({mode: "detach"});
    }

    ipcMain.on("showMyself", () => {
        win.show();
    });

    ipcMain.on("reportUsedInput", (_, inputName) => {
        trayMenuState.currentDevice = inputName;
        trayMenuState.state = "inactive";
        updateTrayMenu();
    });

    win.loadFile("index.html");
}

/** @type {Electron.CrossProcessExports.Tray} */
let tray;
const trayMenuIcon = nativeImage.createFromPath("assets/icon.png").resize({width: 22, height: 22});
const trayMenuState = {
    currentDevice: null,
    state: "default"
}

function updateTrayMenu() {
    const template = [];

    template.push({
        icon: trayMenuIcon,
        label: "Aux In",
        enabled: false
    });

    if (process.platform === "win32") {
        template.push(
            {
                label: "Change input device",
                sublabel: trayMenuState.currentDevice ?? "Click to configure",
                click() {
                    win.show();
                }
            }
        );
    } else {
        template.push(
            {
                label: "Change input device",
                click() {
                    win.show();
                }
            },
            {
                label: trayMenuState.currentDevice ?? "Click to configure",
                enabled: false
            },
            {type: "separator"}
        );

        switch (trayMenuState.state) {
            case "default":
                template.push({
                    icon: "",
                    label: "Włącz",
                    enabled: false
                });
                break;
            case "active":
                 break;
            case "inactive":
                break;
            default:
                break;
        }
    }

    tray.setContextMenu(Menu.buildFromTemplate(template));
    tray.setImage(`assets/tray/${trayMenuState.state}.png`);
}

app.whenReady().then(() => {
    createWindow();

    tray = new Tray("assets/tray/default.png");
    tray.setToolTip("Aux In");
    updateTrayMenu(false);
});

app.on("window-all-closed", () => {});
