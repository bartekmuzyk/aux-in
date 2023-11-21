const inputSelector = document.getElementById("input-selection");
const saveButton = document.getElementById("save-button");

document.addEventListener("DOMContentLoaded", async () => {
    const deviceToUse = localStorage.getItem("input");

    if (deviceToUse) {
        alert(deviceToUse);
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputs = devices.filter(device =>
        device.kind === "audioinput" &&
        !["default", "communications"].includes(device.deviceId)
    );

    for (const input of inputs) {
        const button = document.createElement("input");
        button.type = "radio";
        button.id = button.value = input.deviceId;
        button.name = "audioinput";

        const label = document.createElement("label");
        label.setAttribute("for", input.deviceId);
        label.innerText = input.label;

        inputSelector.appendChild(button);
        inputSelector.appendChild(label);
    }

    saveButton.innerText = "✅ Apply";
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
    alert("Applied!");
    location.reload();
};
