
(function() {
    // NEW: This module adds the recommended per-child, accumulative Gus star system
    // without changing the existing functions, variables, styling, or reward pool.
    var NEW_GUS_CHILD_STATE_KEY = 'gusChildStarStates';
    var NEW_GUS_CHILD_SETTINGS_KEY = 'gusChildRewardSettings';
    var NEW_GUS_CHILD_HISTORY_KEY = 'gusChildRewardHistory';

    // NEW: Default milestone settings. Parents can change these independently for each child.
    var NEW_GUS_DEFAULT_THRESHOLDS = { LOW: 10, MEDIUM: 25, HIGH: 50 };

    function newPerChildRead(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return fallback;
            var parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function newPerChildWrite(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
    }

    // NEW: Each child gets a lifetime star total and their own next reward stage.
    function newGetChildGusState(childId) {
        var all = newPerChildRead(NEW_GUS_CHILD_STATE_KEY, {});
        var id = String(childId || 'child');
        if (!all[id]) all[id] = { totalStars: 0, stage: 0 };
        if (!Number.isFinite(parseInt(all[id].totalStars, 10))) all[id].totalStars = 0;
        if (![0, 1, 2].includes(parseInt(all[id].stage, 10))) all[id].stage = 0;
        newPerChildWrite(NEW_GUS_CHILD_STATE_KEY, all);
        return all[id];
    }

    function newSaveChildGusState(childId, state) {
        var all = newPerChildRead(NEW_GUS_CHILD_STATE_KEY, {});
        all[String(childId || 'child')] = {
            totalStars: Math.max(0, Math.floor(Number(state.totalStars) || 0)),
            stage: [0, 1, 2].includes(parseInt(state.stage, 10)) ? parseInt(state.stage, 10) : 0
        };
        newPerChildWrite(NEW_GUS_CHILD_STATE_KEY, all);
    }

    // NEW: Read each child's parent-controlled LOW/MEDIUM/HIGH thresholds.
    function newGetChildGusSettings(childId) {
        var all = newPerChildRead(NEW_GUS_CHILD_SETTINGS_KEY, {});
        var id = String(childId || 'child');
        if (!all[id]) all[id] = Object.assign({}, NEW_GUS_DEFAULT_THRESHOLDS);
        ['LOW', 'MEDIUM', 'HIGH'].forEach(function(tier) {
            var value = parseInt(all[id][tier], 10);
            if (!Number.isFinite(value) || value < 1) all[id][tier] = NEW_GUS_DEFAULT_THRESHOLDS[tier];
        });
        newPerChildWrite(NEW_GUS_CHILD_SETTINGS_KEY, all);
        return all[id];
    }

    function newSaveChildGusSettings(childId, settings) {
        var all = newPerChildRead(NEW_GUS_CHILD_SETTINGS_KEY, {});
        all[String(childId || 'child')] = {
            LOW: Math.max(1, Math.floor(Number(settings.LOW) || NEW_GUS_DEFAULT_THRESHOLDS.LOW)),
            MEDIUM: Math.max(1, Math.floor(Number(settings.MEDIUM) || NEW_GUS_DEFAULT_THRESHOLDS.MEDIUM)),
            HIGH: Math.max(1, Math.floor(Number(settings.HIGH) || NEW_GUS_DEFAULT_THRESHOLDS.HIGH))
        };
        newPerChildWrite(NEW_GUS_CHILD_SETTINGS_KEY, all);
    }

    function newGetChildNextGusMilestone(childId) {
        var state = newGetChildGusState(childId);
        var settings = newGetChildGusSettings(childId);
        var tiers = ['LOW', 'MEDIUM', 'HIGH'];
        var stage = parseInt(state.stage, 10);
        var tier = tiers[stage] || 'LOW';
        return { tier: tier, threshold: settings[tier], stage: stage, totalStars: state.totalStars };
    }

    function newGetChildGusHistory(childId) {
        var all = newPerChildRead(NEW_GUS_CHILD_HISTORY_KEY, {});
        var id = String(childId || 'child');
        if (!Array.isArray(all[id])) all[id] = [];
        return all;
    }

    function newRecordChildGusReward(childId, tier, reward, starsRequired) {
        var all = newGetChildGusHistory(childId);
        var id = String(childId || 'child');
        all[id].push({
            id: 'gus_child_reward_' + Date.now(),
            date: newGusDateKey(),
            tier: tier,
            reward: reward ? reward.name : '',
            starsRequired: starsRequired
        });
        all[id] = all[id].slice(-50);
        newPerChildWrite(NEW_GUS_CHILD_HISTORY_KEY, all);
    }

    function newGetActiveChildGusHistory(childId) {
        var all = newGetChildGusHistory(childId);
        return all[String(childId || 'child')] || [];
    }

    // NEW: Reward checks are lifetime/accumulative: stars are never spent when a milestone is claimed.
    function newCheckPerChildGusMilestone(child) {
        if (!child || !child.id) return;
        var state = newGetChildGusState(child.id);
        var milestone = newGetChildNextGusMilestone(child.id);
        if (state.totalStars < milestone.threshold) return;

        var reward = newPickGusReward(milestone.tier);
        if (!reward) return;

        state.stage = milestone.stage === 2 ? 0 : milestone.stage + 1;
        newSaveChildGusState(child.id, state);
        newRecordChildGusReward(child.id, milestone.tier, reward, milestone.threshold);
        newShowPerChildGusRewardModal(child, milestone.tier, reward, milestone.threshold);
    }

    // NEW: Kid-facing reward celebration and persistent history.
    function newShowPerChildGusRewardModal(child, tier, reward, starsRequired) {
        var existing = document.getElementById('newPerChildGusRewardModal');
        if (existing) existing.remove();
        var modal = document.createElement('div');
        modal.id = 'newPerChildGusRewardModal';
        modal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[75] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
                <div class="relative z-10">
                    <div class="mx-auto w-32 h-28 flex items-end justify-center text-7xl" style="animation:newPerChildGusBounce 1s ease-in-out infinite">🐶✨</div>
                    <div class="text-[10px] font-extrabold tracking-widest text-indigo-500 uppercase">${tier} Gus Surprise</div>
                    <h3 class="font-black text-slate-900 text-xl mt-1">Gus gave you a reward!</h3>
                    <p class="text-xs text-slate-500 mt-1">You reached ${starsRequired} stars for this Gus surprise.</p>
                    <div class="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                        <div class="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">Your Reward</div>
                        <div class="font-black text-amber-900 text-lg mt-1">${reward ? reward.name : 'A special surprise from Gus!'}</div>
                    </div>
                    <p class="text-[10px] font-bold text-slate-500 mt-3">Your stars stay with you — keep making Gus happy!</p>
                    <button id="newPerChildGusRewardClose" class="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md">Yay, Gus! 🐾</button>
                </div>
            </div>`;
        var style = document.createElement('style');
        style.id = 'newPerChildGusRewardStyle';
        style.textContent = '@keyframes newPerChildGusBounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.08)}}';
        document.head.appendChild(style);
        document.body.appendChild(modal);
        var close = document.getElementById('newPerChildGusRewardClose');
        if (close) close.onclick = function() {
            modal.remove();
            var styleNode = document.getElementById('newPerChildGusRewardStyle');
            if (styleNode) styleNode.remove();
            if (typeof renderKidsPortal === 'function' && !appData.isParentMode) renderKidsPortal();
            if (typeof renderParentPortal === 'function' && appData.isParentMode) renderParentPortal();
        };
        if (typeof AudioEngine !== 'undefined' && AudioEngine.playCoin) { try { AudioEngine.playCoin(); } catch (e) {} }
        if (typeof confetti === 'function') { try { confetti({ particleCount: 90, spread: 100, origin: { y: 0.55 } }); } catch (e) {} }
    }

    // NEW: Per-child daily star award. The daily amount is still 0/1/2, but the child's total is accumulative.
    function newAwardPerChildGusStars(child, requestedDay) {
        if (!child || !child.id) return 0;
        var progress = newGetTodayGusChoreProgress(child, requestedDay);
        var dateKey = newGusDateKey();
        if (requestedDay && requestedDay !== getCurrentDayAbbrev()) {
            var weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
            if (Object.prototype.hasOwnProperty.call(weekdayMap, requestedDay)) {
                var target = weekdayMap[requestedDay];
                var d = new Date();
                var diff = (d.getDay() - target + 7) % 7;
                if (diff === 0) diff = 7;
                d.setDate(d.getDate() - diff);
                dateKey = newGusDateKey(d);
            }
        }
        var history = newPerChildRead('gusPerChildDailyStarHistory', {});
        var historyKey = dateKey + ':' + String(child.id);
        var already = parseInt(history[historyKey] || '0', 10);
        if (!Number.isFinite(already) || already < 0) already = 0;
        var added = Math.max(0, progress.stars - already);
        if (added > 0) {
            history[historyKey] = progress.stars;
            newPerChildWrite('gusPerChildDailyStarHistory', history);
            var state = newGetChildGusState(child.id);
            state.totalStars += added;
            newSaveChildGusState(child.id, state);
            newCheckPerChildGusMilestone(child);
        }
        return added;
    }

    // NEW: Replaces only the public approveChore reference so the legacy shared-bank wrapper cannot spend stars.
    // NEW: Existing approveChore logic still runs first; this module then maintains the new per-child system.
    function newPerChildClearLegacyStarBank() {
        try {
            localStorage.setItem('gusStarBank', '0');
        } catch (e) {}
    }

    var newPerChildOriginalApprove = window.approveChore;
    window.approveChore = function(childId, choreId, day) {
        // NEW: Keep the legacy shared bank at zero so its old reward cycle cannot issue a duplicate reward.
        newPerChildClearLegacyStarBank();
        var result = newPerChildOriginalApprove.apply(this, arguments);
        newPerChildClearLegacyStarBank();
        try {
            var child = appData.children.find(function(c) { return c.id === childId; });
            if (child) {
                newAwardPerChildGusStars(child, day);
                saveData();
            }
        } catch (e) { console.warn('Per-child Gus star update failed.', e); }
        if (typeof renderKidsPortal === 'function' && !appData.isParentMode) renderKidsPortal();
        return result;
    };

    // NEW: Add a parent-only threshold editor to the existing Gus Reward Pool section.
    function newRenderPerChildGusParentSettings() {
        var manager = document.getElementById('newGusRewardManager');
        if (!manager || !appData || !appData.isParentMode) return;
        var box = document.getElementById('newPerChildGusThresholds');
        if (!box) {
            box = document.createElement('div');
            box.id = 'newPerChildGusThresholds';
            box.className = 'mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-3';
            manager.appendChild(box);
        }
        var children = Array.isArray(appData.children) ? appData.children : [];
        box.innerHTML = `
            <div class="text-[10px] font-extrabold tracking-wider text-indigo-600 uppercase mb-2">Gus Stars — Per Child Reward Settings</div>
            <p class="text-xs text-slate-500 mb-3">Each child keeps their own lifetime Gus stars. Parents can choose how many stars trigger each type of surprise.</p>
            <div class="space-y-3">
                ${children.length ? children.map(function(child) {
                    var settings = newGetChildGusSettings(child.id);
                    var state = newGetChildGusState(child.id);
                    return `
                        <div class="bg-white rounded-xl border border-slate-200 p-3">
                            <div class="flex items-center justify-between gap-2 mb-2">
                                <div class="text-xs font-extrabold text-slate-800">${child.name || 'Child'}</div>
                                <div class="text-[10px] font-bold text-amber-700">⭐ ${state.totalStars} lifetime stars</div>
                            </div>
                            <div class="grid grid-cols-3 gap-2">
                                ${['LOW','MEDIUM','HIGH'].map(function(tier) {
                                    return `<label class="text-[10px] font-bold text-slate-500">${tier}<input type="number" min="1" value="${settings[tier]}" data-gus-child-threshold="${child.id}" data-gus-tier="${tier}" class="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-700"></label>`;
                                }).join('')}
                            </div>
                            <button data-gus-save-thresholds="${child.id}" class="mt-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold">Save thresholds</button>
                        </div>`;
                }).join('') : '<div class="text-xs text-slate-400">No children found.</div>'}
            </div>`;
        box.querySelectorAll('[data-gus-save-thresholds]').forEach(function(button) {
            button.onclick = function() {
                var childId = button.getAttribute('data-gus-save-thresholds');
                var settings = {};
                ['LOW','MEDIUM','HIGH'].forEach(function(tier) {
                    var input = box.querySelector('[data-gus-child-threshold="' + childId + '"][data-gus-tier="' + tier + '"]');
                    settings[tier] = Math.max(1, parseInt(input ? input.value : NEW_GUS_DEFAULT_THRESHOLDS[tier], 10) || NEW_GUS_DEFAULT_THRESHOLDS[tier]);
                });
                newSaveChildGusSettings(childId, settings);
                newRenderPerChildGusParentSettings();
            };
        });
    }

    // NEW: Add a persistent reward history to the kid Gus widget without replacing the existing widget.
    function newRenderPerChildGusKidHistory() {
        var widget = document.getElementById('newGusStarWidget');
        var child = typeof getActiveChild === 'function' ? getActiveChild() : null;
        if (!widget || !child) return;
        var state = newGetChildGusState(child.id);
        var next = newGetChildNextGusMilestone(child.id);
        var history = newGetActiveChildGusHistory(child.id).slice().reverse();
        var historyBox = document.getElementById('newPerChildGusKidHistory');
        if (!historyBox) {
            historyBox = document.createElement('div');
            historyBox.id = 'newPerChildGusKidHistory';
            widget.appendChild(historyBox);
        }
        var remaining = Math.max(0, next.threshold - state.totalStars);
        historyBox.innerHTML = `
            <div class="mt-4 pt-4 border-t border-slate-100">
                <div class="flex items-center justify-between gap-2">
                    <div class="text-xs font-extrabold text-slate-700">Gus Reward History</div>
                    <div class="text-[10px] font-bold text-amber-700">⭐ ${state.totalStars} total</div>
                </div>
                <div class="text-[10px] font-bold text-slate-500 mt-1">Next ${next.tier} surprise: ${remaining} more star${remaining === 1 ? '' : 's'} • stars are not spent when Gus rewards you.</div>
                <div class="mt-2 space-y-1.5">
                    ${history.length ? history.slice(0, 5).map(function(item) {
                        return `<div class="flex items-center justify-between gap-2 rounded-lg bg-amber-50 border border-amber-100 px-2.5 py-2"><span class="text-[10px] font-bold text-slate-700">🐶 ${item.reward}</span><span class="text-[9px] font-extrabold text-amber-700">${item.tier} • ${item.date}</span></div>`;
                    }).join('') : '<div class="text-[10px] text-slate-400">Gus has not given you a surprise yet. Keep making him happy!</div>'}
                </div>
            </div>`;
    }

    // NEW: Refresh the isolated additions after the existing portals render.
    var newPerChildOriginalKidRender = window.renderKidsPortal;
    window.renderKidsPortal = function() {
        var result = newPerChildOriginalKidRender.apply(this, arguments);
        newRenderPerChildGusKidHistory();
        return result;
    };

    var newPerChildOriginalParentRender = window.renderParentPortal;
    window.renderParentPortal = function() {
        var result = newPerChildOriginalParentRender.apply(this, arguments);
        newRenderPerChildGusParentSettings();
        return result;
    };

    // NEW: Initialize the isolated per-child layer after the existing app has loaded.
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof renderParentPortal === 'function' && appData.isParentMode) newRenderPerChildGusParentSettings();
        if (typeof renderKidsPortal === 'function' && !appData.isParentMode) newRenderPerChildGusKidHistory();
    });
})();
