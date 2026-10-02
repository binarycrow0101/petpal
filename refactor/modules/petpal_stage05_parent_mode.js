// STAGE 05: PARENT MODE / PIN CONTROLS EXTRACTED WITHOUT API CHANGES
        // TOGGLE PARENT / KIDS MODE
        function toggleParentMode() {
            if (appData.isParentMode) {
                appData.isParentMode = false;
                saveData();
                renderApp();
            } else {
                // Open PIN verification modal
                const modal = document.getElementById('pinModal');
                const pinInput = document.getElementById('pinInput');
                if (modal && pinInput) {
                    pinInput.value = '';
                    modal.classList.remove('hidden');
                    setTimeout(() => pinInput.focus(), 100);
                }
            }
        }

        function closePinModal() {
            const modal = document.getElementById('pinModal');
            if (modal) modal.classList.add('hidden');
        }

        function verifyParentPin() {
            const pinInput = document.getElementById('pinInput');
            if (pinInput && pinInput.value === appData.parentPin) {
                appData.isParentMode = true;
                closePinModal();
                saveData();
                renderApp();
            } else {
                alert("Incorrect PIN! Default PIN is 1234.");
                if (pinInput) pinInput.value = '';
            }
        }

        function updateParentPin() {
            const pinInput = document.getElementById('inputParentPin');
            if (pinInput && pinInput.value.length === 4) {
                appData.parentPin = pinInput.value;
                saveData();
                alert("Parent PIN successfully updated!");
                pinInput.value = '';
            } else {
                alert("PIN must be exactly 4 digits.");
            }
        }

