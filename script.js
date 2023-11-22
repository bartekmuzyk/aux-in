const inputSelector = document.getElementById("input-selection");
const saveButton = document.getElementById("save-button");

document.addEventListener("DOMContentLoaded", async () => {
    if (!app.isWindows) {
        document.body.style.background = "#111111f7";
    }

    const inputToUse = localStorage.getItem("input");

    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputs = devices.filter(device =>
        device.kind === "audioinput" &&
        !["default", "communications"].includes(device.deviceId)
    );
    let usedInputName = null;

    for (const input of inputs) {
        const button = document.createElement("input");
        button.type = "radio";
        button.id = button.value = input.deviceId;
        button.name = "audioinput";

        if (input.deviceId === inputToUse) {
            button.checked = true;
            usedInputName = input.label;
        }

        const label = document.createElement("label");
        label.setAttribute("for", input.deviceId);
        label.innerText = input.label;

        inputSelector.appendChild(button);
        inputSelector.appendChild(label);
        inputSelector.appendChild(document.createElement("br"));
    }

    saveButton.innerText = "✅ Apply";

    if (inputToUse) {
        if (usedInputName) {
            app.reportUsedInput(usedInputName);
        } else {
            app.requireAttention("Previously set input cannot be found now. Please select something else.");
            localStorage.removeItem("input");
        }
    } else {
        app.showMyself();
        alert("Welcome to Aux In!\n\nSince this program wasn't configured yet, please select the appropriate input that will be looped to your default output device.");
    }

    saveButton.removeAttribute("disabled");
});

saveButton.onclick = () => {
    /** @type {?HTMLInputElement} */
    const selectedOption = document.querySelector('#input-selection > input[type="radio"]:checked');

    if (!selectedOption) {
        alert("Please choose a device.");
        return;
    }

    localStorage.setItem("input", selectedOption.value);
    location.reload();
};

app.onActivityStateChanged(state => {

});

class Volume {
    current = 100;

    static higher() {

    }

    static lower() {

    }
}
