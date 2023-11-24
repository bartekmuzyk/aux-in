const inputSelector = document.getElementById("input-selection");
const saveButton = document.getElementById("save-button");
const player = document.getElementById("player");
const volumeDisplay = document.getElementById("volume-display");
const volumeLowerBtn = document.getElementById("volume-lower-btn");
const volumeHigherBtn = document.getElementById("volume-higher-btn");

class PlayerManagement {
    #currentVolume = 100;
    #active = false;
    /** @type {HTMLAudioElement} */
    #player;

    constructor(player) {
        this.#player = player;

        const savedVolume = localStorage.getItem("volume");
        if (savedVolume) {
            this.#currentVolume = Number(savedVolume);
        }

        this.active = false;
    }

    setup(stream) {
        this.#player.srcObject = stream;
        this.#player.play();
    }

    get volume() {
        return this.#currentVolume;
    }

    #clampVolume() {
        this.#currentVolume = Math.max(Math.min(this.#currentVolume, 100), 5);
    }

    #saveVolume() {
        localStorage.setItem("volume", this.#currentVolume.toString());
    }

    volumeHigher() {
        this.#currentVolume += 5;
        this.#clampVolume();
        this.#saveVolume();

        if (this.#active) {
            this.#player.volume = this.#currentVolume / 100;
        }
    }

    volumeLower() {
        this.#currentVolume -= 5;
        this.#clampVolume();
        this.#saveVolume();

        if (this.#active) {
            this.#player.volume = this.#currentVolume / 100;
        }
    }

    set active(v) {
        this.#active = v;
        this.#player.volume =  v ? this.#currentVolume / 100 : 0;
    }
}

const playerManagement = new PlayerManagement(player);

document.addEventListener("DOMContentLoaded", async () => {
    if (!app.isWindows) {
        document.body.style.background = "#111111f7";
    }

    updateVolumeDisplay();

    const inputToUse = {
        deviceId: localStorage.getItem("input"),
        label: null
    };

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

        if (input.deviceId === inputToUse.deviceId) {
            button.checked = true;
            inputToUse.label = input.label;
        }

        const label = document.createElement("label");
        label.setAttribute("for", input.deviceId);
        label.innerText = input.label;

        inputSelector.appendChild(button);
        inputSelector.appendChild(label);
        inputSelector.appendChild(document.createElement("br"));
    }

    saveButton.innerText = "✅ Apply";

    if (inputToUse.deviceId) {
        if (inputToUse.label) {
            let stream;

            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: false,
                    audio: {
                        deviceId: {exact: inputToUse.deviceId},
                        autoGainControl: false,
                        channelCount: 2,
                        echoCancellation: false,
                        noiseSuppression: false,
                        sampleRate: 48000,
                        sampleSize: 16
                    }
                });
            } catch (e) {
                app.requireAttention(e.message);
            }

            if (stream) {
                playerManagement.setup(stream);
                app.reportUsedInput(inputToUse.label);
            }
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
    playerManagement.active = state === "active";
});

function updateVolumeDisplay() {
    volumeDisplay.innerText = `${playerManagement.volume}%`;
}

volumeLowerBtn.onclick = () => {
    playerManagement.volumeLower();
    updateVolumeDisplay();
};

volumeHigherBtn.onclick = () => {
    playerManagement.volumeHigher();
    updateVolumeDisplay();
};
