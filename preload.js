const {ipcRenderer, contextBridge} = require("electron");

contextBridge.exposeInMainWorld("app", {
    showMyself() {
        ipcRenderer.send("showMyself");
    },
    get isWindows() {
        return process.platform === "win32";
    },
    reportUsedInput(inputName) {
        ipcRenderer.send("reportUsedInput", inputName);
    }
});
