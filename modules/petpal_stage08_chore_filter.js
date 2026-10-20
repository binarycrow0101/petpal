// STAGE 08: CHORE HISTORY / DAY FILTER EXTRACTED WITHOUT API CHANGES
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
