// Display messages on the page
const displayMessage = (message, isError = false) => {
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "red" : "green";
};

// NFC Reading Function
async function startReading() {
    if ('NDEFReader' in window) {
        const nfcReader = new NDEFReader();
        try {
            await nfcReader.scan();
            displayMessage("Scanning for NFC tags...");

            nfcReader.onreading = event => {
                const { serialNumber } = event;
                displayMessage(`NFC tag detected! Serial Number: ${serialNumber}`);

                // Read message from the NFC tag
                event.message.records.forEach(record => {
                    if (record.recordType === "text") {
                        const textDecoder = new TextDecoder();
                        const text = textDecoder.decode(record.data);
                        displayMessage(`NFC Text: ${text}`);
                    } else {
                        displayMessage("Unknown record type found.");
                    }
                });
            };
        } catch (error) {
            displayMessage("Error during NFC scan: " + error, true);
        }
    } else {
        displayMessage("NFC is not supported on this device.", true);
    }
}

// NFC Writing Function
async function writeToNFC() {
    if ('NDEFReader' in window) {
        const nfcWriter = new NDEFWriter();
        const textToWrite = document.getElementById("writeData").value;

        if (!textToWrite) {
            displayMessage("Please enter some text to write.", true);
            return;
        }

        try {
            await nfcWriter.write({
                records: [{ recordType: "text", data: textToWrite }]
            });
            displayMessage(`Data "${textToWrite}" written to NFC tag successfully!`);
        } catch (error) {
            displayMessage("Error writing to NFC tag: " + error, true);
        }
    } else {
        displayMessage("NFC writing is not supported on this device.", true);
    }
}
