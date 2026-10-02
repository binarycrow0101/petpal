// STAGE 06: CHILD PROFILE MANAGEMENT EXTRACTED WITHOUT API CHANGES
        function renderChildProfileDropdown() {
            const select = document.getElementById('childProfileSelect');
            if (!select) return;
            select.innerHTML = appData.children.map(c => 
                `<option value="${c.id}" ${c.id === appData.activeChildId ? 'selected' : ''}>${c.name}</option>`
            ).join('');
        }

        function switchChildProfile(childId) {
            appData.activeChildId = childId;
            saveData();
            renderApp();
        }

        function promptAddChild() {
            const name = prompt("Enter new child's name:");
            if (name && name.trim()) {
                const newId = 'child_' + Date.now();
                appData.children.push({
                    id: newId,
                    name: name.trim(),
                    balance: 0,
                    gusPoints: 20,
                    screenTimeBank: 0,
                    happiness: 80,
                    chores: [
                        {
                            id: 'c_' + Date.now() + '_1',
                            title: 'Feed Gus Breakfast',
                            description: 'Fill dry food bowl to line and change water.',
                            reward: 1.00,
                            gusPointsReward: 10,
                            screenTimeReward: 15,
                            frequency: 'daily',
                            days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                            statusByDay: {}
                        }
                    ]
                });
                appData.activeChildId = newId;
                saveData();
                renderChildProfileDropdown();
                renderApp();
            }
        }

        function promptEditActiveChildName() {
            const child = getActiveChild();
            const newName = prompt("Rename child profile:", child.name);
            if (newName && newName.trim()) {
                child.name = newName.trim();
                saveData();
                renderChildProfileDropdown();
                renderApp();
            }
        }

        function saveParentChildName() {
            const child = getActiveChild();
            const input = document.getElementById('parentChildNameInput');
            if (input && input.value.trim()) {
                child.name = input.value.trim();
                saveData();
                renderChildProfileDropdown();
                renderApp();
                alert("Child profile name updated!");
            }
        }

        function deleteActiveChildProfile() {
            if (appData.children.length <= 1) {
                alert("You must have at least one child profile!");
                return;
            }
            const child = getActiveChild();
            if (confirm(`Are you sure you want to delete profile for "${child.name}"?`)) {
                appData.children = appData.children.filter(c => c.id !== child.id);
                appData.activeChildId = appData.children[0].id;
                saveData();
                renderChildProfileDropdown();
                renderApp();
            }
        }

