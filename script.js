(() => {
    const displayMessage = (message, isError = false) => {
        const statusMessage = document.getElementById("statusMessage");
        statusMessage.textContent = message;
        statusMessage.style.color = isError ? "red" : "green";
    };

    const startReading = async () => {
        if (!('NDEFReader' in window)) {
            displayMessage("Your browser does not support NFC functionality.", true);
            return;
        }

        const nfcReader = new NDEFReader();
        try {
            await nfcReader.scan();
            displayMessage("Scanning for NFC tags...");

            nfcReader.onreading = (event) => {
                const { serialNumber, message } = event;
                displayMessage(`NFC tag detected! Serial Number: ${serialNumber}`);

                message.records.forEach((record) => {
                    if (record.recordType === "text") {
                        const text = new TextDecoder().decode(record.data);
                        displayMessage(`NFC Text: ${text}`);
                    } else {
                        displayMessage(`Unknown record type: ${record.recordType}`);
                    }
                });
            };
        } catch (error) {
            displayMessage(`Error during NFC scan: ${error.message}`, true);
        }
    };

    const writeToNFC = async () => {
        if (!('NDEFWriter' in window)) {
            displayMessage("Your browser does not support NFC writing functionality.", true);
            return;
        }

        const nfcWriter = new NDEFWriter();
        const textToWrite = document.getElementById("writeData").value;

        if (!textToWrite) {
            displayMessage("Please enter some text to write.", true);
            return;
        }

        try {
            await nfcWriter.write({ records: [{ recordType: "text", data: textToWrite }] });
            displayMessage(`Data "${textToWrite}" written to NFC tag successfully!`);
        } catch (error) {
            displayMessage(`Error writing to NFC tag: ${error.message}`, true);
        }
    };

    window.startReading = startReading;
    window.writeToNFC = writeToNFC;
})();
