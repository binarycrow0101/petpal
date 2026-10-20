// STAGE 24: DAILY GUS STAR TARGET SYSTEM
// Extracted mechanically from Stage 23 without changing implementation.

(function() {
    // NEW: This module changes only how NEW Gus Stars are earned: approved chore Gus Points
    // count toward a child-specific daily target instead of using the number of chores completed.
    // NEW: Existing app functions and the earlier modules remain untouched.
    var NEW_GUS_DAILY_TARGETS_KEY = 'gusChildDailyStarTargets';
    var NEW_GUS_TARGET_DAILY_HISTORY_KEY = 'gusTargetDailyStarHistory';
    var NEW_GUS_CHILD_STATE_TARGET_KEY = 'gusChildStarStates';
    var NEW_GUS_CHILD_REWARD_HISTORY_TARGET_KEY = 'gusChildRewardHistory';
    var NEW_GUS_REWARDS_POOL_TARGET_KEY = 'gusRewardsPool';
    var NEW_GUS_DEFAULT_DAILY_TARGET = 10;

    // NEW: Read a JSON object from isolated localStorage.
    function newDailyGoalRead(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return fallback;
            var parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : fallback;
        } catch (e) {
            return fallback;
        }
    }

    // NEW: Save a JSON object without touching appData or existing storage.
    function newDailyGoalWrite(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
    }

    // NEW: Return a safe child-specific daily Gus target.
    function newGetGusDailyTarget(childId) {
        var all = newDailyGoalRead(NEW_GUS_DAILY_TARGETS_KEY, {});
        var id = String(childId || 'child');
        var value = parseInt(all[id], 10);
        if (!Number.isFinite(value) || value < 1) value = NEW_GUS_DEFAULT_DAILY_TARGET;
        all[id] = value;
        newDailyGoalWrite(NEW_GUS_DAILY_TARGETS_KEY, all);
        return value;
    }

    // NEW: Save a child's daily Gus target independently of all existing chore settings.
    function newSaveGusDailyTarget(childId, value) {
        var all = newDailyGoalRead(NEW_GUS_DAILY_TARGETS_KEY, {});
        all[String(childId || 'child')] = Math.max(1, Math.floor(Number(value) || NEW_GUS_DEFAULT_DAILY_TARGET));
        newDailyGoalWrite(NEW_GUS_DAILY_TARGETS_KEY, all);
    }

    // NEW: Match the app's local calendar date convention.
    function newDailyGoalDateKey(date) {
        var d = date || new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    // NEW: If a parent approves a different weekday from today, use the most recent matching date,
    // matching the date handling already used by the existing Gus-star modules.
    function newDailyGoalApprovalDate(requestedDay) {
        var date = new Date();
        if (requestedDay && typeof getCurrentDayAbbrev === 'function' && requestedDay !== getCurrentDayAbbrev()) {
            var weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
            if (Object.prototype.hasOwnProperty.call(weekdayMap, requestedDay)) {
                var target = weekdayMap[requestedDay];
                var diff = (date.getDay() - target + 7) % 7;
                if (diff === 0) diff = 7;
                date.setDate(date.getDate() - diff);
            }
        }
        return newDailyGoalDateKey(date);
    }

    // NEW: Calculate completed Gus Points for the selected day. This uses the value already assigned
    // to each chore, so larger chores can naturally contribute more without changing their rewards.
    function newGetDailyGusPointProgress(child, requestedDay) {
        var day = requestedDay || (typeof getCurrentDayAbbrev === 'function' ? getCurrentDayAbbrev() : '');
        var scheduled = (child && Array.isArray(child.chores)) ? child.chores.filter(function(chore) {
            return Array.isArray(chore.days) && chore.days.includes(day);
        }) : [];
        var completed = scheduled.filter(function(chore) {
            if (typeof ensureChoreStatusByDay === 'function') ensureChoreStatusByDay(chore);
            return chore.statusByDay && chore.statusByDay[day] === 'completed';
        });
        var points = completed.reduce(function(total, chore) {
            var value = Number(chore.gusPointsReward);
            return total + (Number.isFinite(value) && value > 0 ? value : 0);
        }, 0);
        return {
            day: day,
            completedChores: completed.length,
            availableChores: scheduled.length,
            completedPoints: points,
            target: newGetGusDailyTarget(child && child.id)
        };
    }

    // NEW: Convert daily Gus Points into daily Gus Stars. One star is earned at the daily target;
    // a second star is earned at twice the target. Stars are still accumulated monthly and are never spent.
    function newGetDailyTargetStarCount(progress) {
        if (!progress || !progress.target) return 0;
        if (progress.completedPoints >= progress.target * 2) return 2;
        if (progress.completedPoints >= progress.target) return 1;
        return 0;
    }

    // NEW: Load/save the target-based daily award history so the same day's stars cannot be awarded twice.
    function newGetTargetDailyHistory() {
        return newDailyGoalRead(NEW_GUS_TARGET_DAILY_HISTORY_KEY, {});
    }

    // NEW: Read the current per-child monthly star state created by the existing v7 module.
    function newGetTargetChildState(childId) {
        var all = newDailyGoalRead(NEW_GUS_CHILD_STATE_TARGET_KEY, {});
        var id = String(childId || 'child');
        if (!all[id]) all[id] = { totalStars: 0, stage: 0 };
        all[id].totalStars = Math.max(0, Math.floor(Number(all[id].totalStars) || 0));
        all[id].stage = [0, 1, 2].includes(parseInt(all[id].stage, 10)) ? parseInt(all[id].stage, 10) : 0;
        newDailyGoalWrite(NEW_GUS_CHILD_STATE_TARGET_KEY, all);
        return all[id];
    }

    // NEW: Save the monthly state without changing its existing structure.
    function newSaveTargetChildState(childId, state) {
        var all = newDailyGoalRead(NEW_GUS_CHILD_STATE_TARGET_KEY, {});
        all[String(childId || 'child')] = {
            totalStars: Math.max(0, Math.floor(Number(state.totalStars) || 0)),
            stage: [0, 1, 2].includes(parseInt(state.stage, 10)) ? parseInt(state.stage, 10) : 0
        };
        newDailyGoalWrite(NEW_GUS_CHILD_STATE_TARGET_KEY, all);
    }

    // NEW: Read the parent-configured LOW/MEDIUM/HIGH thresholds used by the existing v7 reward system.
    function newGetTargetRewardSettings(childId) {
        var all = newDailyGoalRead('gusChildRewardSettings', {});
        var id = String(childId || 'child');
        var settings = all[id] || { LOW: 10, MEDIUM: 25, HIGH: 50 };
        ['LOW', 'MEDIUM', 'HIGH'].forEach(function(tier) {
            var value = parseInt(settings[tier], 10);
            if (!Number.isFinite(value) || value < 1) settings[tier] = { LOW: 10, MEDIUM: 25, HIGH: 50 }[tier];
        });
        all[id] = settings;
        newDailyGoalWrite('gusChildRewardSettings', all);
        return settings;
    }

    // NEW: Get the next reward milestone using the existing LOW -> MEDIUM -> HIGH cycle.
    function newGetTargetNextMilestone(childId, state) {
        var settings = newGetTargetRewardSettings(childId);
        var tiers = ['LOW', 'MEDIUM', 'HIGH'];
        var stage = [0, 1, 2].includes(parseInt(state.stage, 10)) ? parseInt(state.stage, 10) : 0;
        var tier = tiers[stage];
        return { tier: tier, threshold: settings[tier], stage: stage };
    }

    // NEW: Select a reward directly from the existing persistent reward pool.
    function newPickTargetReward(tier) {
        var rewards = newDailyGoalRead(NEW_GUS_REWARDS_POOL_TARGET_KEY, []);
        var matching = Array.isArray(rewards) ? rewards.filter(function(reward) {
            return String(reward.tier || '').toUpperCase() === tier;
        }) : [];
        return matching.length ? matching[Math.floor(Math.random() * matching.length)] : null;
    }

    // NEW: Record a reward in the existing per-child reward history format so the current kid history remains compatible.
    function newRecordTargetReward(childId, tier, reward, starsRequired) {
        var all = newDailyGoalRead(NEW_GUS_CHILD_REWARD_HISTORY_TARGET_KEY, {});
        var id = String(childId || 'child');
        if (!Array.isArray(all[id])) all[id] = [];
        all[id].push({
            id: 'gus_child_reward_target_' + Date.now(),
            date: newDailyGoalDateKey(),
            tier: tier,
            reward: reward ? reward.name : '',
            starsRequired: starsRequired
        });
        all[id] = all[id].slice(-50);
        newDailyGoalWrite(NEW_GUS_CHILD_REWARD_HISTORY_TARGET_KEY, all);
    }

    // NEW: Show the target-based Gus celebration without changing the earlier reward modal implementation.
    function newShowTargetReward(child, tier, reward, starsRequired) {
        var existing = document.getElementById('newDailyTargetGusRewardModal');
        if (existing) existing.remove();
        var modal = document.createElement('div');
        modal.id = 'newDailyTargetGusRewardModal';
        modal.className = 'fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
                <div class="relative z-10">
                    <div class="mx-auto w-32 h-28 flex items-end justify-center text-7xl" style="animation:newDailyTargetGusBounce 1s ease-in-out infinite">🐶✨</div>
                    <div class="text-[10px] font-extrabold tracking-widest text-indigo-500 uppercase">${tier} Gus Surprise</div>
                    <h3 class="font-black text-slate-900 text-xl mt-1">Gus gave you a reward!</h3>
                    <p class="text-xs text-slate-500 mt-1">You reached ${starsRequired} stars for this Gus surprise.</p>
                    <div class="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                        <div class="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">Your Reward</div>
                        <div class="font-black text-amber-900 text-lg mt-1">${reward ? reward.name : 'A special surprise from Gus!'}</div>
                    </div>
                    <p class="text-[10px] font-bold text-slate-500 mt-3">Your stars stay with you all month!</p>
                    <button id="newDailyTargetGusRewardClose" class="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md">Yay, Gus! 🐾</button>
                </div>
            </div>`;
        var style = document.createElement('style');
        style.id = 'newDailyTargetGusRewardStyle';
        style.textContent = '@keyframes newDailyTargetGusBounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.08)}}';
        document.head.appendChild(style);
        document.body.appendChild(modal);
        var close = document.getElementById('newDailyTargetGusRewardClose');
        if (close) close.onclick = function() {
            modal.remove();
            var styleNode = document.getElementById('newDailyTargetGusRewardStyle');
            if (styleNode) styleNode.remove();
            if (typeof renderKidsPortal === 'function' && !appData.isParentMode) renderKidsPortal();
        };
        if (typeof AudioEngine !== 'undefined' && AudioEngine.playCoin) { try { AudioEngine.playCoin(); } catch (e) {} }
        if (typeof confetti === 'function') { try { confetti({ particleCount: 90, spread: 100, origin: { y: 0.55 } }); } catch (e) {} }
    }

    // NEW: Apply any newly reached reward milestones. Stars are never deducted.
    function newCheckTargetRewardMilestone(child) {
        if (!child || !child.id) return;
        var state = newGetTargetChildState(child.id);
        var milestone = newGetTargetNextMilestone(child.id, state);
        if (state.totalStars < milestone.threshold) return;
        var reward = newPickTargetReward(milestone.tier);
        if (!reward) return;
        state.stage = milestone.stage === 2 ? 0 : milestone.stage + 1;
        newSaveTargetChildState(child.id, state);
        newRecordTargetReward(child.id, milestone.tier, reward, milestone.threshold);
        newShowTargetReward(child, milestone.tier, reward, milestone.threshold);
    }

    // NEW: Prevent the earlier percentage-based Gus-star module from awarding the same approval.
    // NEW: We temporarily mark its legacy daily history as fully awarded, then the target system below
    // records the correct 0/1/2 stars in its own history. Existing approveChore logic remains untouched.
    function newBlockLegacyGusStarAward(childId, requestedDay) {
        var dateKey = newDailyGoalApprovalDate(requestedDay) + ':' + String(childId || 'child');
        var history = newDailyGoalRead('gusPerChildDailyStarHistory', {});
        history[dateKey] = 2;
        newDailyGoalWrite('gusPerChildDailyStarHistory', history);
    }

    // NEW: Award target-based monthly stars after the original approval workflow completes.
    function newAwardTargetGusStars(child, requestedDay) {
        if (!child || !child.id) return 0;
        var progress = newGetDailyGusPointProgress(child, requestedDay);
        var desiredStars = newGetDailyTargetStarCount(progress);
        var history = newGetTargetDailyHistory();
        var historyKey = newDailyGoalApprovalDate(requestedDay) + ':' + String(child.id);
        var already = parseInt(history[historyKey] || '0', 10);
        if (!Number.isFinite(already) || already < 0) already = 0;
        var added = Math.max(0, desiredStars - already);
        if (added > 0) {
            history[historyKey] = desiredStars;
            newDailyGoalWrite(NEW_GUS_TARGET_DAILY_HISTORY_KEY, history);
            var state = newGetTargetChildState(child.id);
            state.totalStars += added;
            newSaveTargetChildState(child.id, state);
            newCheckTargetRewardMilestone(child);
        }
        return added;
    }

    // NEW: Render a compact parent control for the daily Gus target beside the existing per-child thresholds.
    function newRenderGusDailyGoalParentSettings() {
        var box = document.getElementById('newPerChildGusThresholds');
        if (!box || !appData || !appData.isParentMode) return;
        var goalBox = document.getElementById('newGusDailyGoalSettings');
        if (!goalBox) {
            goalBox = document.createElement('div');
            goalBox.id = 'newGusDailyGoalSettings';
            goalBox.className = 'mt-3 pt-3 border-t border-slate-200';
            box.appendChild(goalBox);
        }
        var children = Array.isArray(appData.children) ? appData.children : [];
        goalBox.innerHTML = `
            <div class="text-[10px] font-extrabold tracking-wider text-indigo-600 uppercase mb-1">Daily Gus Goal</div>
            <p class="text-[10px] text-slate-500 mb-2">Set how many completed Gus Points each child needs in a day to earn 1 Gus Star. Twice the goal earns 2 stars.</p>
            <div class="space-y-2">
                ${children.length ? children.map(function(child) {
                    return `<div class="flex items-center justify-between gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2">
                        <span class="text-[10px] font-extrabold text-slate-700">${child.name || 'Child'}</span>
                        <label class="flex items-center gap-1 text-[10px] font-bold text-slate-500">Goal
                            <input type="number" min="1" step="1" value="${newGetGusDailyTarget(child.id)}" data-gus-daily-goal="${child.id}" class="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-700">
                        </label>
                    </div>`;
                }).join('') : '<div class="text-xs text-slate-400">No children found.</div>'}
            </div>
            <button id="newGusSaveDailyGoals" class="mt-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold">Save daily Gus goals</button>`;
        var save = document.getElementById('newGusSaveDailyGoals');
        if (save) save.onclick = function() {
            goalBox.querySelectorAll('[data-gus-daily-goal]').forEach(function(input) {
                newSaveGusDailyTarget(input.getAttribute('data-gus-daily-goal'), input.value);
            });
            newRenderGusDailyGoalParentSettings();
            if (typeof renderKidsPortal === 'function' && !appData.isParentMode) renderKidsPortal();
        };
    }

    // NEW: Add a kid-facing daily goal display. It explains why the star reward is fair even when chore lists differ in size.
    function newRenderGusDailyGoalKidWidget() {
        var widget = document.getElementById('newGusStarWidget');
        var child = typeof getActiveChild === 'function' ? getActiveChild() : null;
        if (!widget || !child) return;
        var progress = newGetDailyGusPointProgress(child);
        var dailyStars = newGetDailyTargetStarCount(progress);
        var targetBox = document.getElementById('newGusDailyGoalKidBox');
        if (!targetBox) {
            targetBox = document.createElement('div');
            targetBox.id = 'newGusDailyGoalKidBox';
            targetBox.className = 'mt-4 pt-4 border-t border-slate-100';
            widget.appendChild(targetBox);
        }
        var width = Math.min(100, Math.round((progress.completedPoints / Math.max(1, progress.target)) * 100));
        targetBox.innerHTML = `
            <div class="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
                <span>Gus's Daily Goal</span>
                <span>🐾 ${Math.min(progress.completedPoints, progress.target)} / ${progress.target}</span>
            </div>
            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div class="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500" style="width:${width}%"></div>
            </div>
            <div class="text-[10px] font-bold text-slate-500 mt-1.5">${dailyStars === 2 ? '🌟 2 Gus Stars earned today!' : (dailyStars === 1 ? '⭐ 1 Gus Star earned today!' : Math.max(0, progress.target - progress.completedPoints) + ' more Gus Points to earn a star.')}</div>
            <div class="text-[10px] font-bold text-slate-400 mt-1">Your chores can add up to Gus's goal — you do not need to complete every chore on the list.</div>`;
    }

    // NEW: Update only the existing NEW Gus widget's dynamic star/mood text so it agrees with the target system.
    function newRefreshTargetBasedGusWidgetText() {
        var widget = document.getElementById('newGusStarWidget');
        var child = typeof getActiveChild === 'function' ? getActiveChild() : null;
        if (!widget || !child) return;
        var progress = newGetDailyGusPointProgress(child);
        var stars = newGetDailyTargetStarCount(progress);
        var state = newGetTargetChildState(child.id);
        var mood = stars >= 2 ? 'Gus is Super Happy! 🐶' : (stars === 1 ? 'Gus is Happy! 🐶' : 'Gus needs a little help today. 🐶');
        var heading = widget.querySelector('h3');
        if (heading && heading.parentElement && heading.parentElement.parentElement) heading.textContent = mood;
        var starBadge = widget.querySelector('.bg-amber-50');
        if (starBadge) starBadge.textContent = stars === 0 ? '0 Stars' : '⭐'.repeat(stars);
        widget.querySelectorAll('div, span').forEach(function(node) {
            if (node.children.length === 0 && node.textContent.indexOf("Today's stars earned:") === 0) {
                node.textContent = "Today's stars earned: " + stars;
            }
        });
        widget.querySelectorAll('div, span').forEach(function(node) {
            if (node.children.length === 0 && node.textContent.indexOf('lifetime') !== -1) {
                node.textContent = node.textContent.replace(/lifetime/g, 'this month');
            }
        });
        void state;
    }

    // NEW: Wrap the current approveChore chain. The original approval logic and all prior wrappers still execute.
    var newDailyGoalPreviousApprove = window.approveChore;
    if (typeof newDailyGoalPreviousApprove === 'function') {
        window.approveChore = function(childId, choreId, day) {
            newBlockLegacyGusStarAward(childId, day);
            var result = newDailyGoalPreviousApprove.apply(this, arguments);
            try {
                var child = appData.children.find(function(c) { return c.id === childId; });
                if (child) {
                    newAwardTargetGusStars(child, day);
                    saveData();
                }
            } catch (e) { console.warn('Daily Gus goal star update failed.', e); }
            if (typeof renderKidsPortal === 'function' && !appData.isParentMode) renderKidsPortal();
            return result;
        };
    }

    // NEW: Keep the target UI synchronized after every existing portal render.
    var newDailyGoalPreviousKidRender = window.renderKidsPortal;
    if (typeof newDailyGoalPreviousKidRender === 'function') {
        window.renderKidsPortal = function() {
            var result = newDailyGoalPreviousKidRender.apply(this, arguments);
            newRenderGusDailyGoalKidWidget();
            newRefreshTargetBasedGusWidgetText();
            return result;
        };
    }

    var newDailyGoalPreviousParentRender = window.renderParentPortal;
    if (typeof newDailyGoalPreviousParentRender === 'function') {
        window.renderParentPortal = function() {
            var result = newDailyGoalPreviousParentRender.apply(this, arguments);
            newRenderGusDailyGoalParentSettings();
            return result;
        };
    }

    // NEW: Initialize the daily target layer without altering the existing app initialization.
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof renderParentPortal === 'function' && appData.isParentMode) newRenderGusDailyGoalParentSettings();
        if (typeof renderKidsPortal === 'function' && !appData.isParentMode) {
            newRenderGusDailyGoalKidWidget();
            newRefreshTargetBasedGusWidgetText();
        }
    });

    // NEW: Public helpers for testing and future isolated UI controls.
    window.petpalGetGusDailyGoal = newGetGusDailyTarget;
    window.petpalGetGusDailyPointProgress = newGetDailyGusPointProgress;
    window.petpalGetGusDailyStarCount = newGetDailyTargetStarCount;
})();
