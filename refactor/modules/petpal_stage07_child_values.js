// STAGE 07: CHILD BALANCE / GUS POINTS / SCREEN-TIME SETTINGS
// Existing implementations moved mechanically; APIs and behavior unchanged.

function saveParentChildValues() {
    const child = getActiveChild();
    const balInput = document.getElementById('parentEditBalance');
    const ptsInput = document.getElementById('parentEditGusPoints');
    const stInput = document.getElementById('parentEditScreenTime');

    if (balInput && ptsInput && stInput) {
        child.balance = Math.max(0, parseFloat(balInput.value || 0));
        child.gusPoints = Math.max(0, parseInt(ptsInput.value || 0));
        child.screenTimeBank = Math.max(0, parseInt(stInput.value || 0));
        saveData();
        renderApp();
        alert(`Updated balances for ${child.name}!`);
    }
}

function updateScreenTimeRates() {
    const treat = parseInt(document.getElementById('stTreatInput').value || 15);
    const brush = parseInt(document.getElementById('stGroomInput').value || 20);
    const play = parseInt(document.getElementById('stFetchInput').value || 30);
    appData.screenTimeRates = { treat, brush, play };
    saveData();
}
