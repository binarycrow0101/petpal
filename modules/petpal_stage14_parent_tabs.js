// STAGE 14: PARENT TAB NAVIGATION EXTRACTED WITHOUT API CHANGES
function switchParentTab(tabName) {
    appData.activeParentTab = tabName;
    
    ['approvals', 'manage', 'settings'].forEach(t => {
        const btn = document.getElementById(`tabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
        const view = document.getElementById(`parentTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
        if (btn && view) {
            if (t === tabName) {
                btn.className = "py-2.5 px-4 font-bold text-xs rounded-t-xl border-b-2 border-indigo-600 text-indigo-600 flex items-center gap-2";
                view.classList.remove('hidden');
            } else {
                btn.className = "py-2.5 px-4 font-bold text-xs rounded-t-xl border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center gap-2";
                view.classList.add('hidden');
            }
        }
    });
}
