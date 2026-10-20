        // Persistence: Load Data
        function loadData() {
            try {
                const stored = localStorage.getItem('petpal_app_data');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed.children && parsed.children.length > 0) {
                        appData = Object.assign(appData, parsed);
                    }
                }
            } catch (e) {
                console.warn("Could not load stored data, using defaults.", e);
            }
        }

        // Persistence: Save Data
        function saveData() {
            try {
                localStorage.setItem('petpal_app_data', JSON.stringify(appData));
            } catch (e) {
                console.error("Failed to save data.", e);
            }
        }

        // Helper: Get Active Child
        function getActiveChild() {
            return appData.children.find(c => c.id === appData.activeChildId) || appData.children[0];
        }

        // Helper: Ensure Chore statusByDay object
        function ensureChoreStatusByDay(chore) {
            if (!chore.statusByDay || typeof chore.statusByDay !== 'object') {
                chore.statusByDay = {};
            }
        }
