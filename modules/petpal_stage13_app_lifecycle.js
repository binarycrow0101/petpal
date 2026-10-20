// STAGE 13: APP LIFECYCLE EXTRACTED WITHOUT API CHANGES
        function renderApp() {
            const kidsView = document.getElementById('kidsPortalView');
            const parentView = document.getElementById('parentPortalView');
            const toggleLabel = document.getElementById('modeToggleLabel');
            const toggleIcon = document.getElementById('modeToggleIcon');

            if (appData.isParentMode) {
                kidsView.classList.add('hidden');
                parentView.classList.remove('hidden');
                toggleLabel.innerText = "Kids View";
                toggleIcon.className = "fa-solid fa-child";
                renderParentPortal();
            } else {
                parentView.classList.add('hidden');
                kidsView.classList.remove('hidden');
                toggleLabel.innerText = "Parent Mode";
                toggleIcon.className = "fa-solid fa-lock";
                renderKidsPortal();
            }
        }

        function init() {
            loadData();
            renderChildProfileDropdown();
            renderApp();
        }

        document.addEventListener('DOMContentLoaded', init);
