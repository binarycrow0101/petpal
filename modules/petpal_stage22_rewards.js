// STAGE 22: REWARD POOL SUBSYSTEM
// Exact extraction of the existing Stage 21 reward-pool layer.
// Kept as a classic script and in the same execution position to preserve behaviour.

(function() {
    // NEW: Storage keys are isolated from the existing PetPal app data.
    var GUS_REWARDS_POOL_KEY = 'gusRewardsPool';
    var GUS_STAR_BANK_KEY = 'gusStarBank';
    var GUS_STAR_HISTORY_KEY = 'gusStarDailyHistory';
    var GUS_REWARD_HISTORY_KEY = 'gusRewardHistory';

    // NEW: Default reward pool is created only when no custom pool exists yet.
    function newDefaultGusRewards() {
        return [
            { id: 'low_1', name: 'Pick dessert', tier: 'LOW' },
            { id: 'low_2', name: 'Stay up 15 minutes late', tier: 'LOW' },
            { id: 'medium_1', name: 'Pick movie night', tier: 'MEDIUM' },
            { id: 'medium_2', name: 'Trip to get ice cream', tier: 'MEDIUM' },
            { id: 'high_1', name: '$10 App Store card', tier: 'HIGH' },
            { id: 'high_2', name: 'Special weekend outing', tier: 'HIGH' }
        ];
    }

    // NEW: Read/write the independent reward pool.
    function newGetGusRewards() {
        try {
            var raw = localStorage.getItem(GUS_REWARDS_POOL_KEY);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (e) {
            console.warn('Could not load Gus reward pool.', e);
        }

        var defaults = newDefaultGusRewards();
        try {
            localStorage.setItem(GUS_REWARDS_POOL_KEY, JSON.stringify(defaults));
        } catch (e) {}
        return defaults;
    }

    // NEW: Save the reward pool without touching appData.
    function newSaveGusRewards(rewards) {
        try {
            localStorage.setItem(GUS_REWARDS_POOL_KEY, JSON.stringify(rewards));
        } catch (e) {
            console.error('Could not save Gus reward pool.', e);
        }
    }

    // NEW: Read/write the persistent star bank.
    function newGetGusStarBank() {
        try {
            var value = parseInt(localStorage.getItem(GUS_STAR_BANK_KEY) || '0', 10);
            return Number.isFinite(value) && value >= 0 ? value : 0;
        } catch (e) {
            return 0;
        }
    }

    function newSetGusStarBank(value) {
        try {
            localStorage.setItem(GUS_STAR_BANK_KEY, String(Math.max(0, Math.floor(value))));
        } catch (e) {}
    }

    // NEW: Use a local calendar date key so each day's calculation is independent.
    function newGusDateKey(date) {
        var d = date || new Date();
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return y + '-' + m + '-' + day;
    }

    // NEW: Calculate scheduled chores and completion percentage for the supplied approval day.
    function newGetTodayGusChoreProgress(child, requestedDay) {
        // NEW: Use the day supplied by the existing approval workflow when available.
        var today = requestedDay || getCurrentDayAbbrev();
        var scheduled = (child && Array.isArray(child.chores)) ? child.chores.filter(function(chore) {
            return Array.isArray(chore.days) && chore.days.includes(today);
        }) : [];

        var completed = scheduled.filter(function(chore) {
            ensureChoreStatusByDay(chore);
            return chore.statusByDay[today] === 'completed';
        }).length;

        var percent = scheduled.length ? Math.round((completed / scheduled.length) * 100) : 0;
        var stars = 0;
        if (scheduled.length > 0) {
            if (percent >= 90) stars = 2;
            else if (percent >= 70) stars = 1;
        }

        return {
            day: today,
            scheduled: scheduled.length,
            completed: completed,
            percent: percent,
            stars: stars
        };
    }

    // NEW: Daily star awards are incremental, so moving from 70% to 90% awards only the extra star.
    // NEW: The optional requestedDay comes directly from the existing approveChore(childId, choreId, day) call.
    function newAwardDailyGusStars(child, requestedDay) {
        if (!child) return { added: 0, progress: newGetTodayGusChoreProgress(child, requestedDay) };

        // NEW: Calculate the approved weekday rather than always using today's weekday.
        var progress = newGetTodayGusChoreProgress(child, requestedDay);
        var dateKey = newGusDateKey();
        // NEW: When approval is for another weekday, use the most recent calendar date matching that weekday.
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
        dateKey = dateKey + ':' + String(child.id || 'child');
        var history = {};

        try {
            history = JSON.parse(localStorage.getItem(GUS_STAR_HISTORY_KEY) || '{}') || {};
        } catch (e) {
            history = {};
        }

        var alreadyAwarded = parseInt(history[dateKey] || '0', 10);
        if (!Number.isFinite(alreadyAwarded) || alreadyAwarded < 0) alreadyAwarded = 0;

        var added = Math.max(0, progress.stars - alreadyAwarded);
        if (added > 0) {
            history[dateKey] = progress.stars;
            try {
                localStorage.setItem(GUS_STAR_HISTORY_KEY, JSON.stringify(history));
            } catch (e) {}
            newSetGusStarBank(newGetGusStarBank() + added);
        }

        return { added: added, progress: progress };
    }

    // NEW: Determine the next surprise milestone in the fixed LOW -> MEDIUM -> HIGH cycle.
    function newGetNextGusTier(starBank) {
        var stage = 0;
        try {
            stage = parseInt(localStorage.getItem('gusRewardStage') || '0', 10);
            if (![0, 1, 2].includes(stage)) stage = 0;
        } catch (e) {
            stage = 0;
        }

        if (stage === 0) return { tier: 'LOW', threshold: 10, stage: 0 };
        if (stage === 1) return { tier: 'MEDIUM', threshold: 25, stage: 1 };
        return { tier: 'HIGH', threshold: 50, stage: 2 };
    }

    // NEW: Save the next position in the Gus surprise cycle.
    function newSetGusRewardStage(stage) {
        try {
            localStorage.setItem('gusRewardStage', String(stage));
        } catch (e) {}
    }

    // NEW: Pick a random reward from the requested tier.
    function newPickGusReward(tier) {
        var matching = newGetGusRewards().filter(function(reward) {
            return String(reward.tier || '').toUpperCase() === tier;
        });
        if (!matching.length) return null;
        return matching[Math.floor(Math.random() * matching.length)];
    }

    // NEW: Record each surprise reward in a lightweight local history.
    function newRecordGusReward(tier, reward, starsSpent) {
        var history = [];
        try {
            history = JSON.parse(localStorage.getItem(GUS_REWARD_HISTORY_KEY) || '[]') || [];
        } catch (e) {
            history = [];
        }

        history.push({
            id: 'gus_reward_' + Date.now(),
            date: newGusDateKey(),
            tier: tier,
            reward: reward ? reward.name : '',
            starsSpent: starsSpent
        });

        try {
            localStorage.setItem(GUS_REWARD_HISTORY_KEY, JSON.stringify(history.slice(-50)));
        } catch (e) {}
    }

    // NEW: Show the isolated Gus reward modal without modifying any existing modal.
    function newShowGusRewardModal(tier, reward, starsSpent) {
        var existing = document.getElementById('newGusRewardModal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.id = 'newGusRewardModal';
        modal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
                <div class="absolute -top-12 -right-12 w-28 h-28 bg-amber-100 rounded-full opacity-60"></div>
                <div class="absolute -bottom-14 -left-10 w-28 h-28 bg-indigo-100 rounded-full opacity-60"></div>
                <div class="relative z-10">
                    <div id="newGusRewardArt" class="mx-auto w-32 h-28 flex items-end justify-center text-7xl" style="animation:newGusSpit 1s ease-in-out infinite">🐶✨</div>
                    <div class="text-[10px] font-extrabold tracking-widest text-indigo-500 uppercase">${tier} Gus Surprise</div>
                    <h3 class="font-black text-slate-900 text-xl mt-1">Gus spit out a reward!</h3>
                    <p class="text-xs text-slate-500 mt-1">${starsSpent} stars were used for this surprise.</p>
                    <div class="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                        <div class="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">Your Reward</div>
                        <div class="font-black text-amber-900 text-lg mt-1">${reward ? reward.name : 'A special surprise from Gus!'}</div>
                    </div>
                    <button id="newGusRewardClose" class="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md">Yay, Gus! 🐾</button>
                </div>
            </div>
        `;

        var style = document.createElement('style');
        style.id = 'newGusRewardStyle';
        style.textContent = '@keyframes newGusSpit{0%,100%{transform:translateY(0) scale(1) rotate(-2deg)}50%{transform:translateY(-12px) scale(1.08) rotate(2deg)}}';
        document.head.appendChild(style);
        document.body.appendChild(modal);

        var close = document.getElementById('newGusRewardClose');
        if (close) close.onclick = function() {
            modal.remove();
            var rewardStyle = document.getElementById('newGusRewardStyle');
            if (rewardStyle) rewardStyle.remove();
            if (typeof renderKidsPortal === 'function' && !appData.isParentMode) renderKidsPortal();
            if (typeof renderParentPortal === 'function' && appData.isParentMode) renderParentPortal();
        };

        if (typeof AudioEngine !== 'undefined' && AudioEngine.playCoin) {
            try { AudioEngine.playCoin(); } catch (e) {}
        }
        if (typeof confetti === 'function') {
            try { confetti({ particleCount: 90, spread: 100, origin: { y: 0.55 } }); } catch (e) {}
        }
    }

    // NEW: Trigger the next earned milestone without changing existing chore logic.
    function newCheckGusRewardThresholds() {
        var starBank = newGetGusStarBank();
        var tierInfo = newGetNextGusTier(starBank);

        if (starBank < tierInfo.threshold) return;

        var reward = newPickGusReward(tierInfo.tier);

        // NEW: If a tier has no available reward, leave the stars banked rather than silently losing them.
        if (!reward) return;

        starBank -= tierInfo.threshold;
        newSetGusStarBank(starBank);
        newRecordGusReward(tierInfo.tier, reward, tierInfo.threshold);

        // NEW: Move to the next tier; after HIGH, restart at LOW.
        newSetGusRewardStage(tierInfo.stage === 2 ? 0 : tierInfo.stage + 1);

        newShowGusRewardModal(tierInfo.tier, reward, tierInfo.threshold);
    }

    // NEW: Calculate and award stars after an existing chore approval completes.
    var newGusOriginalApproveChore = window.approveChore;
    window.approveChore = function(childId, choreId, day) {
        var result = newGusOriginalApproveChore.apply(this, arguments);

        try {
            var child = appData.children.find(function(c) { return c.id === childId; });
            if (child) {
                newAwardDailyGusStars(child, day);
                newCheckGusRewardThresholds();
                saveData();
            }
        } catch (e) {
            console.warn('Gus star reward update failed.', e);
        }

        if (typeof renderKidsPortal === 'function' && !appData.isParentMode) renderKidsPortal();
        return result;
    };

    // NEW: Build the kid dashboard widget as a separate DOM block.
    function newRenderGusKidWidget() {
        var portal = document.getElementById('kidsPortalView');
        if (!portal) return;

        var widget = document.getElementById('newGusStarWidget');
        if (!widget) {
            widget = document.createElement('div');
            widget.id = 'newGusStarWidget';
            widget.className = 'bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm';
            portal.appendChild(widget);
        }

        var child = getActiveChild();
        var progress = newGetTodayGusChoreProgress(child);
        var starBank = newGetGusStarBank();
        var next = newGetNextGusTier(starBank);
        var previous = next.threshold === 10 ? 0 : 0;
        var range = next.threshold;
        var progressStars = Math.max(0, Math.min(starBank, range));
        var progressWidth = Math.min(100, Math.round((progressStars / range) * 100));

        var mood = progress.stars >= 2 ? 'Gus is Super Happy! 🐶' : (progress.stars === 1 ? 'Gus is Happy! 🐶' : 'Gus needs a little help today. 🐶');
        var starsText = progress.stars === 0 ? '0 Stars' : '⭐'.repeat(progress.stars);

        widget.innerHTML = `
            <div class="flex items-center justify-between gap-3">
                <div>
                    <div class="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500">Gus Happiness & Stars</div>
                    <h3 class="font-black text-slate-800 text-base mt-0.5">${mood}</h3>
                </div>
                <div class="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-extrabold border border-amber-100">${starsText}</div>
            </div>
            <div class="mt-4">
                <div class="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span>Today's Progress</span>
                    <span>${progress.completed}/${progress.scheduled} chores • ${progress.percent}%</span>
                </div>
                <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500" style="width:${progress.percent}%"></div>
                </div>
                <div class="text-[10px] font-bold text-slate-500 mt-1.5">Today's stars earned: ${progress.stars}</div>
            </div>
            <div class="mt-4">
                <div class="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span>Gus's Treat Progress</span>
                    <span>⭐ ${progressStars} / ${range} Stars</span>
                </div>
                <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div class="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500" style="width:${progressWidth}%"></div>
                </div>
                <div class="text-[10px] font-bold text-slate-500 mt-1.5">Next surprise: ${next.tier} reward at ${next.threshold} stars</div>
            </div>
        `;
    }

    // NEW: Build the parent reward-pool manager inside the existing Settings tab.
    function newRenderGusRewardManager() {
        var settings = document.getElementById('parentTabSettings');
        if (!settings) return;

        var section = document.getElementById('newGusRewardManager');
        if (!section) {
            section = document.createElement('div');
            section.id = 'newGusRewardManager';
            section.className = 'bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm';
            settings.appendChild(section);
        }

        var rewards = newGetGusRewards();
        var tiers = ['LOW', 'MEDIUM', 'HIGH'];

        section.innerHTML = `
            <div class="flex items-center justify-between gap-3 mb-4">
                <div>
                    <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2"><i class="fa-solid fa-gift text-indigo-600"></i> Gus Reward Pool</h3>
                    <p class="text-xs text-slate-500 mt-1">Add, edit, or remove the treats Gus can surprise the kids with.</p>
                </div>
                <button id="newGusAddRewardBtn" class="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm">+ Add Reward</button>
            </div>
            <div class="space-y-2">
                ${tiers.map(function(tier) {
                    var tierRewards = rewards.filter(function(r) { return String(r.tier || '').toUpperCase() === tier; });
                    return `
                        <div class="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                            <div class="text-[10px] font-extrabold tracking-wider text-indigo-600 uppercase mb-2">${tier} Value</div>
                            <div class="space-y-2">
                                ${tierRewards.length ? tierRewards.map(function(reward) {
                                    return `
                                        <div class="flex items-center justify-between gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2">
                                            <span class="text-xs font-bold text-slate-700">${reward.name}</span>
                                            <span class="flex items-center gap-1">
                                                <button data-gus-edit="${reward.id}" class="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold">Edit</button>
                                                <button data-gus-delete="${reward.id}" class="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-bold">Delete</button>
                                            </span>
                                        </div>
                                    `;
                                }).join('') : '<div class="text-xs text-slate-400">No rewards in this tier yet.</div>'}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        var addButton = document.getElementById('newGusAddRewardBtn');
        if (addButton) addButton.onclick = newAddGusReward;

        section.querySelectorAll('[data-gus-edit]').forEach(function(button) {
            button.onclick = function() { newEditGusReward(button.getAttribute('data-gus-edit')); };
        });

        section.querySelectorAll('[data-gus-delete]').forEach(function(button) {
            button.onclick = function() { newDeleteGusReward(button.getAttribute('data-gus-delete')); };
        });
    }

    // NEW: Parent reward CRUD handlers.
    function newAddGusReward() {
        var name = prompt('Reward / treat name:');
        if (!name || !name.trim()) return;

        var tier = prompt('Tier level: LOW, MEDIUM, or HIGH', 'LOW');
        if (!tier) return;
        tier = tier.trim().toUpperCase();
        if (!['LOW', 'MEDIUM', 'HIGH'].includes(tier)) {
            alert('Please choose LOW, MEDIUM, or HIGH.');
            return;
        }

        var rewards = newGetGusRewards();
        rewards.push({ id: 'reward_' + Date.now(), name: name.trim(), tier: tier });
        newSaveGusRewards(rewards);
        newRenderGusRewardManager();
    }

    function newEditGusReward(id) {
        var rewards = newGetGusRewards();
        var reward = rewards.find(function(r) { return r.id === id; });
        if (!reward) return;

        var name = prompt('Edit reward name:', reward.name);
        if (!name || !name.trim()) return;

        var tier = prompt('Edit tier: LOW, MEDIUM, or HIGH', reward.tier);
        if (!tier) return;
        tier = tier.trim().toUpperCase();
        if (!['LOW', 'MEDIUM', 'HIGH'].includes(tier)) {
            alert('Please choose LOW, MEDIUM, or HIGH.');
            return;
        }

        reward.name = name.trim();
        reward.tier = tier;
        newSaveGusRewards(rewards);
        newRenderGusRewardManager();
    }

    function newDeleteGusReward(id) {
        var rewards = newGetGusRewards();
        var reward = rewards.find(function(r) { return r.id === id; });
        if (!reward) return;

        if (confirm('Delete "' + reward.name + '" from the Gus reward pool?')) {
            newSaveGusRewards(rewards.filter(function(r) { return r.id !== id; }));
            newRenderGusRewardManager();
        }
    }

    // NEW: Refresh the isolated widgets whenever the existing app renders.
    var newGusOriginalRenderKidsPortal = window.renderKidsPortal;
    window.renderKidsPortal = function() {
        var result = newGusOriginalRenderKidsPortal.apply(this, arguments);
        newRenderGusKidWidget();
        return result;
    };

    var newGusOriginalRenderParentPortal = window.renderParentPortal;
    window.renderParentPortal = function() {
        var result = newGusOriginalRenderParentPortal.apply(this, arguments);
        newRenderGusRewardManager();
        return result;
    };

    // NEW: Expose small integration helpers without changing existing functions.
    window.gusCalculateDailyStars = newGetTodayGusChoreProgress;
    window.gusCheckRewardThresholds = newCheckGusRewardThresholds;

    // NEW: Initialize the isolated reward pool after the existing app is initialized.
    document.addEventListener('DOMContentLoaded', function() {
        newGetGusRewards();
        if (typeof renderKidsPortal === 'function' && !appData.isParentMode) {
            newRenderGusKidWidget();
        }
        if (typeof renderParentPortal === 'function' && appData.isParentMode) {
            newRenderGusRewardManager();
        }
    });
})();
