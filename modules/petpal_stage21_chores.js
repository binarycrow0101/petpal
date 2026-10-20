// STAGE 21: CHORES SUBSYSTEM
// Mechanical consolidation of existing chore functions.
// Behaviour, public function names, storage keys, DOM IDs and call order are preserved.

function resetChildTaskHistory() {
    const child = getActiveChild();
    if (confirm(`Reset all chore statuses for ${child.name} to open?`)) {
        child.chores.forEach(c => c.statusByDay = {});
        saveData();
        renderApp();
        alert("Task completion history reset!");
    }
}

function setKidsDayFilter(day) {
    currentKidsDayFilter = day;
    renderKidsPortal();
}

function completeChoreByKid(choreId, day) {
            const child = getActiveChild();
            const chore = child.chores.find(c => c.id === choreId);
            if (!chore) return;

            ensureChoreStatusByDay(chore);
            chore.statusByDay[day] = 'pending';

            AudioEngine.playBark();

            if (typeof confetti === 'function') {
                confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
            }

            saveData();
            renderKidsPortal();
        }

        function approveChore(childId, choreId, day) {
            const child = appData.children.find(c => c.id === childId);
            if (!child) return;
            const chore = child.chores.find(c => c.id === choreId);
            if (!chore) return;

            ensureChoreStatusByDay(chore);
            chore.statusByDay[day] = 'completed';

            // Credit Child Balances
            child.balance = (child.balance || 0) + (chore.reward || 0);
            child.gusPoints = (child.gusPoints || 0) + (chore.gusPointsReward || 10);
            child.screenTimeBank = (child.screenTimeBank || 0) + (chore.screenTimeReward || 15);

            AudioEngine.playCoin();

            saveData();
            renderParentPortal();
        }

        function rejectChore(childId, choreId, day) {
            const child = appData.children.find(c => c.id === childId);
            if (!child) return;
            const chore = child.chores.find(c => c.id === choreId);
            if (!chore) return;

            ensureChoreStatusByDay(chore);
            chore.statusByDay[day] = 'open';

            saveData();
            renderParentPortal();
        }

        function openChoreModal() {
            const modal = document.getElementById('choreModal');
            if (modal) modal.classList.remove('hidden');
        }

        function closeChoreModal() {
            const modal = document.getElementById('choreModal');
            if (modal) modal.classList.add('hidden');
        }

        function saveChore(event) {
            event.preventDefault();
            const child = getActiveChild();

            const title = document.getElementById('choreTitle').value;
            const description = document.getElementById('choreDescription').value;
            const reward = parseFloat(document.getElementById('choreReward').value || 1.00);
            const gusPointsReward = parseInt(document.getElementById('choreGusPoints').value || 10);
            const screenTimeReward = parseInt(document.getElementById('choreScreenTime').value || 15);
            const frequency = document.getElementById('choreFrequency').value;

            const dayCheckboxes = document.querySelectorAll('input[name="choreDays"]:checked');
            const days = Array.from(dayCheckboxes).map(cb => cb.value);

            child.chores.push({
                id: 'c_' + Date.now(),
                title,
                description,
                reward,
                gusPointsReward,
                screenTimeReward,
                frequency,
                days: days.length > 0 ? days : DAYS_OF_WEEK,
                statusByDay: {}
            });

            closeChoreModal();
            saveData();
            renderParentPortal();
        }

        function deleteChore(choreId) {
            const child = getActiveChild();
            if (confirm("Delete this chore?")) {
                child.chores = child.chores.filter(c => c.id !== choreId);
                saveData();
                renderParentPortal();
            }
        }

