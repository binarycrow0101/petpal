const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        let currentKidsDayFilter = getCurrentDayAbbrev();

        // Default Application State
        let appData = {
            isParentMode: false,
            parentPin: "1234",
            activeChildId: "child1",
            activeParentTab: "approvals",
            screenTimeRates: { treat: 15, brush: 20, play: 30 },
            children: [
                {
                    id: "child1",
                    name: "Emma",
                    balance: 12.50,
                    gusPoints: 45,
                    screenTimeBank: 35,
                    happiness: 80,
                    chores: [
                        {
                            id: "c1",
                            title: "Feed Gus Breakfast",
                            description: "Fill dry food bowl to top line and change fresh water.",
                            reward: 1.00,
                            gusPointsReward: 10,
                            screenTimeReward: 15,
                            frequency: "daily",
                            days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                            statusByDay: {}
                        },
                        {
                            id: "c2",
                            title: "Groom & Brush Gus",
                            description: "Brush coat for 5 minutes to keep fluff tangle-free.",
                            reward: 1.50,
                            gusPointsReward: 15,
                            screenTimeReward: 20,
                            frequency: "daily",
                            days: ["Mon", "Wed", "Fri", "Sat"],
                            statusByDay: {}
                        },
                        {
                            id: "c3",
                            title: "Tidy Bedroom & Toys",
                            description: "Put away all toys, books, and make bed neatly.",
                            reward: 2.00,
                            gusPointsReward: 20,
                            screenTimeReward: 30,
                            frequency: "daily",
                            days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                            statusByDay: {}
                        }
                    ]
                }
            ]
        };

        // Helper: Get Day Abbreviation for Today
        function getCurrentDayAbbrev() {
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return days[new Date().getDay()];
        }

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
