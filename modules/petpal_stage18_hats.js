// STAGE 17: GUS HAT SYSTEM EXTRACTED WITHOUT API OR STORAGE CHANGES
// Original inline hat blocks 41-56 preserved in their original execution order.

(function newGusHatCollectionSystem() {
    'use strict';

    // NEW: All hat state is stored separately from the existing Gus Star system.
    var NEW_GUS_HAT_STATE_KEY = 'petpalGusHatCollectionState';
    var NEW_GUS_HAT_START_KEY = 'petpalGusHatCollectionStarted';
    var NEW_GUS_HAT_PANEL_ID = 'newGusHatKidsPanel';
    var NEW_GUS_HAT_PARENT_PANEL_ID = 'newGusHatParentPanel';

    // NEW: Initial approved hat catalogue. The requirement is NEW lifetime Hat Stars,
    // not the child's existing Gus Stars, so the feature begins at zero for everyone.
    var NEW_GUS_HAT_CATALOGUE = [
        { id: 'top_hat', name: 'Top Hat', emoji: '🎩', requirement: 10, type: 'Classic' },
        { id: 'cowboy_hat', name: 'Cowboy Hat', emoji: '🤠', requirement: 20, type: 'Classic' },
        { id: 'baseball_cap', name: 'Baseball Cap', emoji: '🧢', requirement: 35, type: 'Classic' },
        { id: 'graduation_cap', name: 'Graduation Cap', emoji: '🎓', requirement: 50, type: 'Achievement' },
        { id: 'wizard_hat', name: 'Wizard Hat', emoji: '🪄', requirement: 70, type: 'Fantasy' },
        { id: 'crown', name: 'Crown', emoji: '👑', requirement: 90, type: 'Royal' },
        { id: 'pirate_hat', name: 'Pirate Hat', emoji: '🏴‍☠️', requirement: 115, type: 'Adventure' },
        { id: 'chef_hat', name: 'Chef Hat', emoji: '🧑‍🍳', requirement: 140, type: 'Fun' },
        { id: 'christmas_hat', name: 'Christmas Hat', emoji: '🎅', requirement: 170, type: 'Seasonal' },
        { id: 'halloween_hat', name: 'Halloween Hat', emoji: '🎃', requirement: 200, type: 'Seasonal' },
        { id: 'frog_hat', name: 'Frog Hat', emoji: '🐸', requirement: 235, type: 'Silly' },
        { id: 'duck_hat', name: 'Duck Hat', emoji: '🦆', requirement: 275, type: 'Silly' },
        { id: 'bee_hat', name: 'Bee Hat', emoji: '🐝', requirement: 320, type: 'Silly' },
        { id: 'space_helmet', name: 'Space Helmet', emoji: '🚀', requirement: 370, type: 'Special' },
        { id: 'giant_crown', name: 'Giant Crown', emoji: '👑', requirement: 425, type: 'Big Achievement' }
    ];

    // NEW: SVG artwork lives here initially so no extra GitHub asset files are required.
    // Each hat uses the same 200x200 Gus coordinate system. Positioning can be adjusted
    // independently per hat without changing Gus's existing artwork or layout.
    var NEW_GUS_HAT_ART = {
        top_hat: '<g transform="translate(0 -1)"><ellipse cx="100" cy="44" rx="42" ry="6" fill="#111827"/><path d="M68 43 L72 18 Q100 12 128 18 L132 43Z" fill="#171B22"/><ellipse cx="100" cy="18" rx="28" ry="5" fill="#252A30"/><path d="M70 35 L130 35 L128 43 L72 43Z" fill="#7C2D12"/><path d="M75 34 L125 34" stroke="#F59E0B" stroke-width="2"/></g>',
        cowboy_hat: '<g transform="translate(0 -1)"><path d="M58 45 Q70 31 100 31 Q130 31 142 45 Q128 43 118 48 Q100 54 82 48 Q72 43 58 45Z" fill="#B7793D" stroke="#7C4A24" stroke-width="3"/><path d="M74 38 Q100 25 126 38 L121 45 Q100 39 79 45Z" fill="#D59A57"/><path d="M82 38 Q100 34 118 38" fill="none" stroke="#5B351B" stroke-width="3"/></g>',
        baseball_cap: '<g transform="translate(1 1)"><path d="M66 47 Q70 24 100 23 Q127 23 136 44 Q112 38 91 42 Q78 45 66 47Z" fill="#2563EB" stroke="#1E3A8A" stroke-width="3"/><path d="M91 42 Q112 38 143 46 Q128 53 105 50 Q96 48 91 42Z" fill="#60A5FA" stroke="#1E3A8A" stroke-width="2"/><path d="M78 34 Q99 28 121 34" fill="none" stroke="#DBEAFE" stroke-width="3" stroke-linecap="round"/></g>',
        graduation_cap: '<g transform="translate(0 -3)"><path d="M58 37 L100 20 L142 37 L100 54Z" fill="#312E81" stroke="#1E1B4B" stroke-width="3"/><path d="M74 43 Q100 56 126 43 L123 57 Q100 67 77 57Z" fill="#4338CA"/><path d="M139 38 L139 58" stroke="#FBBF24" stroke-width="3"/><circle cx="139" cy="61" r="3" fill="#FBBF24"/><path d="M137 57 Q132 66 125 69" stroke="#FBBF24" stroke-width="3" fill="none"/></g>',
        wizard_hat: '<g transform="translate(0 -3)"><path d="M67 49 Q82 30 100 3 Q118 30 133 49 Q110 44 100 48 Q90 44 67 49Z" fill="#5B21B6" stroke="#3B0764" stroke-width="3"/><path d="M72 43 Q100 35 128 43" fill="none" stroke="#FBBF24" stroke-width="4"/><path d="M96 23 L102 14 L107 24 L117 25 L109 32 L111 42 L101 37 L92 42 L94 31 L86 25Z" fill="#FDE68A"/></g>',
        crown: '<g transform="translate(0 -2)"><path d="M61 47 L66 21 L83 35 L100 17 L117 35 L134 21 L139 47Z" fill="#FBBF24" stroke="#B45309" stroke-width="3"/><path d="M62 45 L138 45 L134 53 L66 53Z" fill="#F59E0B"/><circle cx="66" cy="21" r="4" fill="#EF4444"/><circle cx="100" cy="17" r="4" fill="#60A5FA"/><circle cx="134" cy="21" r="4" fill="#34D399"/></g>',
        pirate_hat: '<g transform="translate(0 -1)"><path d="M62 46 Q75 29 100 30 Q125 29 138 46 Q123 43 100 47 Q77 43 62 46Z" fill="#111827" stroke="#030712" stroke-width="3"/><path d="M76 39 Q100 32 124 39" fill="none" stroke="#F8FAFC" stroke-width="4"/><path d="M94 33 Q100 26 106 33 L105 43 Q100 40 95 43Z" fill="#F8FAFC"/><circle cx="100" cy="35" r="5" fill="#111827"/><path d="M96 32 L104 39 M104 32 L96 39" stroke="#F8FAFC" stroke-width="2"/></g>',
        chef_hat: '<g transform="translate(0 -2)"><path d="M68 45 Q61 35 70 28 Q70 18 82 19 Q88 8 99 18 Q108 8 116 19 Q129 16 130 29 Q140 34 132 45Z" fill="#FFFDF8" stroke="#CBD5E1" stroke-width="3"/><path d="M69 43 L132 43 L128 51 L73 51Z" fill="#E2E8F0"/><path d="M80 34 Q100 28 120 34" fill="none" stroke="#CBD5E1" stroke-width="2"/></g>',
        christmas_hat: '<g transform="translate(0 -2)"><path d="M69 47 Q80 28 106 9 Q109 28 131 47Z" fill="#DC2626" stroke="#991B1B" stroke-width="3"/><path d="M68 46 Q100 40 132 46 L128 53 Q100 48 72 53Z" fill="#FFFDF8" stroke="#CBD5E1" stroke-width="2"/><circle cx="108" cy="9" r="6" fill="#FFFDF8"/></g>',
        halloween_hat: '<g transform="translate(0 -2)"><path d="M64 47 L100 5 L136 47 Q119 42 100 48 Q81 42 64 47Z" fill="#7C3AED" stroke="#4C1D95" stroke-width="3"/><path d="M64 46 Q100 39 136 46 L132 53 Q100 47 68 53Z" fill="#F97316"/><path d="M100 17 L103 25 L111 25 L105 30 L108 38 L100 33 L92 38 L95 30 L89 25 L97 25Z" fill="#FDE68A"/></g>',
        frog_hat: '<g transform="translate(0 -2)"><path d="M66 45 Q68 27 80 27 Q84 17 92 22 Q100 17 108 22 Q116 17 120 27 Q132 27 134 45Z" fill="#65A30D" stroke="#365314" stroke-width="3"/><circle cx="84" cy="25" r="7" fill="#84CC16" stroke="#365314" stroke-width="2"/><circle cx="116" cy="25" r="7" fill="#84CC16" stroke="#365314" stroke-width="2"/><circle cx="84" cy="25" r="2.5" fill="#111827"/><circle cx="116" cy="25" r="2.5" fill="#111827"/><path d="M72 42 Q100 36 128 42" fill="none" stroke="#BEF264" stroke-width="3"/></g>',
        duck_hat: '<g transform="translate(0 -2)"><path d="M70 44 Q70 25 83 24 Q91 13 102 23 Q114 13 123 24 Q134 25 132 44Z" fill="#FACC15" stroke="#A16207" stroke-width="3"/><path d="M99 24 Q119 24 139 32 Q126 40 111 36Z" fill="#F97316" stroke="#C2410C" stroke-width="3"/><circle cx="87" cy="24" r="3" fill="#111827"/></g>',
        bee_hat: '<g transform="translate(0 -2)"><path d="M67 45 Q71 25 83 23 Q100 14 117 23 Q130 25 133 45Z" fill="#FACC15" stroke="#A16207" stroke-width="3"/><path d="M76 25 L124 25 M70 36 L130 36" stroke="#111827" stroke-width="6"/><path d="M88 21 Q82 9 74 14 M112 21 Q120 9 128 14" stroke="#E2E8F0" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/></g>',
        space_helmet: '<g transform="translate(0 -1)"><ellipse cx="100" cy="38" rx="38" ry="31" fill="#E2E8F0" stroke="#64748B" stroke-width="4"/><path d="M68 37 Q100 21 132 37 L129 48 Q100 39 71 48Z" fill="#BFDBFE" stroke="#3B82F6" stroke-width="3" opacity=".95"/><circle cx="78" cy="27" r="4" fill="#F8FAFC"/><circle cx="122" cy="26" r="3" fill="#F8FAFC"/><path d="M87 12 L93 5 M113 12 L119 5" stroke="#64748B" stroke-width="3" stroke-linecap="round"/></g>',
        giant_crown: '<g transform="translate(0 -8) scale(1.15)"><path d="M55 47 L63 14 L82 33 L100 7 L118 33 L137 14 L145 47Z" fill="#FBBF24" stroke="#92400E" stroke-width="3"/><path d="M56 45 L144 45 L138 56 L62 56Z" fill="#F59E0B"/><circle cx="63" cy="14" r="5" fill="#F43F5E"/><circle cx="100" cy="7" r="5" fill="#60A5FA"/><circle cx="137" cy="14" r="5" fill="#34D399"/></g>'
    };

    // NEW: State shape. This never replaces or modifies existing PetPal data.
    function newGusHatReadState() {
        try {
            var raw = localStorage.getItem(NEW_GUS_HAT_STATE_KEY);
            var parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) {
            return {};
        }
    }

    // NEW: Persist only the isolated hat collection state.
    function newGusHatWriteState(state) {
        try { localStorage.setItem(NEW_GUS_HAT_STATE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    // NEW: Child profile access uses the existing public app helper when available.
    function newGusHatActiveChild() {
        try {
            return typeof window.getActiveChild === 'function' ? window.getActiveChild() : null;
        } catch (e) {
            return null;
        }
    }

    // NEW: Read the existing per-child Gus Star totals without changing them.
    function newGusHatReadExistingStarStates() {
        try {
            var raw = localStorage.getItem('gusChildStarStates');
            var parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) {
            return {};
        }
    }

    // NEW: Ensure an isolated state record exists for a child.
    function newGusHatEnsureChild(state, childId, childName) {
        if (!state[childId]) {
            state[childId] = {
                childName: childName || 'Child',
                lifetimeHatStars: 0,
                unlockedHatIds: [],
                currentHatId: null,
                nextHatId: null,
                lastSeenExistingStarTotal: 0,
                startedAt: new Date().toISOString()
            };
        }
        if (!Array.isArray(state[childId].unlockedHatIds)) state[childId].unlockedHatIds = [];
        if (typeof state[childId].lifetimeHatStars !== 'number' || state[childId].lifetimeHatStars < 0) state[childId].lifetimeHatStars = 0;
        return state[childId];
    }

    // NEW: The feature starts from zero even if existing Gus Stars are already present.
    function newGusHatEnsureStarted() {
        try {
            if (!localStorage.getItem(NEW_GUS_HAT_START_KEY)) {
                localStorage.setItem(NEW_GUS_HAT_START_KEY, new Date().toISOString());
            }
        } catch (e) {}
    }

    // NEW: Record only NEW Gus Stars earned after the hat system was introduced.
    function newGusHatRecordStarDelta(childId, childName, beforeTotal, afterTotal) {
        var before = Number(beforeTotal);
        var after = Number(afterTotal);
        if (!Number.isFinite(before)) before = 0;
        if (!Number.isFinite(after)) after = 0;
        var delta = after - before;
        if (delta <= 0) return;

        var state = newGusHatReadState();
        var childState = newGusHatEnsureChild(state, childId, childName);
        childState.lifetimeHatStars += delta;
        childState.lastSeenExistingStarTotal = after;
        newGusHatWriteState(state);
        newGusHatRefreshAll();
    }

    // NEW: Hat artwork renderer. The group is inserted inside Gus's SVG so it follows
    // every animation applied to #gusSvg, including the existing contextual animations.
    function newGusHatRenderOnGus(childState) {
        var gusSvg = document.getElementById('gusSvg');
        if (!gusSvg) return;

        var old = document.getElementById('newGusHatSvgLayer');
        if (old && old.parentNode) old.parentNode.removeChild(old);

        var hatId = childState && childState.currentHatId;
        if (!hatId || !NEW_GUS_HAT_ART[hatId]) return;

        var layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        layer.setAttribute('id', 'newGusHatSvgLayer');
        layer.setAttribute('pointer-events', 'none');
        layer.innerHTML = NEW_GUS_HAT_ART[hatId];
        gusSvg.appendChild(layer);
    }

    // NEW: Get the selected child's isolated hat state.
    function newGusHatGetActiveState() {
        var child = newGusHatActiveChild();
        if (!child || !child.id) return null;
        var state = newGusHatReadState();
        return newGusHatEnsureChild(state, child.id, child.name);
    }

    // NEW: Parent can choose which hat the child is working towards.
    function newGusHatSetNextHat(childId, hatId) {
        var state = newGusHatReadState();
        var child = null;
        try {
            if (window.appData && Array.isArray(window.appData.children)) child = window.appData.children.find(function(c){ return c.id === childId; });
        } catch (e) {}
        var childState = newGusHatEnsureChild(state, childId, child ? child.name : 'Child');
        childState.nextHatId = hatId || null;
        newGusHatWriteState(state);
        newGusHatRefreshAll();
    }

    // NEW: Parent can remove a selected hat without removing it from the collection.
    function newGusHatWear(childId, hatId) {
        var state = newGusHatReadState();
        var childState = newGusHatEnsureChild(state, childId, 'Child');
        if (hatId === null || hatId === '' || childState.unlockedHatIds.indexOf(hatId) !== -1) {
            childState.currentHatId = hatId || null;
            newGusHatWriteState(state);
            newGusHatRefreshAll();
        }
    }

    // NEW: Unlock a parent-selected hat when its isolated lifetime Hat Star requirement is reached.
    function newGusHatCheckUnlock(childId) {
        var state = newGusHatReadState();
        var childState = state[childId];
        if (!childState || !childState.nextHatId) return false;
        var hat = NEW_GUS_HAT_CATALOGUE.find(function(h){ return h.id === childState.nextHatId; });
        if (!hat) return false;
        if (childState.lifetimeHatStars < hat.requirement) return false;
        if (childState.unlockedHatIds.indexOf(hat.id) === -1) {
            childState.unlockedHatIds.push(hat.id);
            childState.currentHatId = hat.id;
            childState.nextHatId = null;
            newGusHatWriteState(state);
            try { alert('🎉 Gus unlocked the ' + hat.name + '!'); } catch (e) {}
            return true;
        }
        return false;
    }

    // NEW: Render the Kids View collection card without changing existing cards or styles.
    function newGusHatRenderKidsPanel() {
        var child = newGusHatActiveChild();
        var host = document.getElementById('kidsPortalView');
        if (!child || !host) return;

        var state = newGusHatReadState();
        var childState = newGusHatEnsureChild(state, child.id, child.name);
        newGusHatCheckUnlock(child.id);
        state = newGusHatReadState();
        childState = newGusHatEnsureChild(state, child.id, child.name);

        var panel = document.getElementById(NEW_GUS_HAT_PANEL_ID);
        if (!panel) {
            panel = document.createElement('div');
            panel.id = NEW_GUS_HAT_PANEL_ID;
            panel.className = 'bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm';
            var grid = host.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12');
            if (grid) host.insertBefore(panel, grid);
            else host.appendChild(panel);
        }

        var next = childState.nextHatId ? NEW_GUS_HAT_CATALOGUE.find(function(h){ return h.id === childState.nextHatId; }) : null;
        var unlocked = NEW_GUS_HAT_CATALOGUE.filter(function(h){ return childState.unlockedHatIds.indexOf(h.id) !== -1; });
        var current = childState.currentHatId ? NEW_GUS_HAT_CATALOGUE.find(function(h){ return h.id === childState.currentHatId; }) : null;
        var progressText = next ? childState.lifetimeHatStars + ' / ' + next.requirement + ' Hat Stars' : childState.lifetimeHatStars + ' Hat Stars earned';
        var collectionHtml = unlocked.length ? unlocked.map(function(h){
            var wearing = childState.currentHatId === h.id;
            return '<button type="button" data-new-gus-hat-wear="' + h.id + '" class="px-3 py-2 rounded-xl border ' + (wearing ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-slate-50') + ' text-xs font-bold text-slate-700">' + h.emoji + ' ' + h.name + (wearing ? ' ✓' : '') + '</button>';
        }).join('') : '<span class="text-xs text-slate-500">No hats unlocked yet — Gus is just getting started!</span>';

        panel.innerHTML =
            '<div class="flex items-center justify-between gap-3 mb-3">' +
                '<div><h3 class="font-black text-slate-800 text-base flex items-center gap-2">🎩 Gus\'s Hat Closet</h3><p class="text-xs text-slate-500 mt-1">Collect hats as you build new Hat Stars.</p></div>' +
                '<div class="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-black">' + childState.lifetimeHatStars + ' 🎩</div>' +
            '</div>' +
            '<div class="rounded-2xl bg-indigo-50 border border-indigo-100 p-3 mb-3">' +
                '<div class="text-[10px] font-black uppercase tracking-wider text-indigo-600">Currently Wearing</div>' +
                '<div class="text-sm font-black text-indigo-900 mt-1">' + (current ? current.emoji + ' ' + current.name : '🐶 No hat') + '</div>' +
            '</div>' +
            (next ? '<div class="rounded-2xl bg-amber-50 border border-amber-200 p-3 mb-3"><div class="text-[10px] font-black uppercase tracking-wider text-amber-700">Next Hat</div><div class="text-sm font-black text-amber-900 mt-1">' + next.emoji + ' ' + next.name + '</div><div class="text-[11px] font-bold text-amber-700 mt-1">' + progressText + '</div><div class="h-2 bg-white rounded-full overflow-hidden mt-2 border border-amber-100"><div class="h-full bg-amber-400 rounded-full" style="width:' + Math.min(100, Math.round((childState.lifetimeHatStars / next.requirement) * 100)) + '%"></div></div></div>' : '<div class="rounded-2xl bg-slate-50 border border-slate-200 p-3 mb-3 text-xs font-bold text-slate-600">Gus is excited for his next hat!</div>') +
            '<div class="flex flex-wrap gap-2">' + collectionHtml + '</div>' +
            (unlocked.length ? '<button type="button" data-new-gus-hat-wear="" class="mt-3 text-xs font-bold text-slate-500 hover:text-slate-800">🐶 No Hat</button>' : '');

        panel.querySelectorAll('[data-new-gus-hat-wear]').forEach(function(button) {
            button.addEventListener('click', function() { newGusHatWear(child.id, button.getAttribute('data-new-gus-hat-wear')); });
        });
    }

    // NEW: Render parent controls inside the existing Settings tab.
    function newGusHatRenderParentPanel() {
        var host = document.getElementById('parentTabSettings');
        if (!host) return;
        var children = [];
        try {
            if (typeof window.getActiveChild === 'function' && window.appData && Array.isArray(window.appData.children)) children = window.appData.children;
        } catch (e) {}
        if (!children.length) {
            try {
                var stored = localStorage.getItem('petpal_app_data');
                var parsed = stored ? JSON.parse(stored) : null;
                if (parsed && Array.isArray(parsed.children)) children = parsed.children;
            } catch (e) {}
        }
        if (!children.length) return;

        var state = newGusHatReadState();
        var panel = document.getElementById(NEW_GUS_HAT_PARENT_PANEL_ID);
        if (!panel) {
            panel = document.createElement('div');
            panel.id = NEW_GUS_HAT_PARENT_PANEL_ID;
            panel.className = 'bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm';
            host.insertBefore(panel, host.firstChild);
        }

        var cards = children.map(function(child) {
            var childState = newGusHatEnsureChild(state, child.id, child.name);
            var next = childState.nextHatId ? NEW_GUS_HAT_CATALOGUE.find(function(h){ return h.id === childState.nextHatId; }) : null;
            var current = childState.currentHatId ? NEW_GUS_HAT_CATALOGUE.find(function(h){ return h.id === childState.currentHatId; }) : null;
            var options = '<option value="">Choose next hat...</option>' + NEW_GUS_HAT_CATALOGUE.map(function(h){ return '<option value="' + h.id + '" ' + (childState.nextHatId === h.id ? 'selected' : '') + '>' + h.emoji + ' ' + h.name + ' — ' + h.requirement + ' stars</option>'; }).join('');
            var wearOptions = '<option value="">No hat</option>' + childState.unlockedHatIds.map(function(id){ var h = NEW_GUS_HAT_CATALOGUE.find(function(x){ return x.id === id; }); return h ? '<option value="' + h.id + '" ' + (childState.currentHatId === h.id ? 'selected' : '') + '>' + h.emoji + ' ' + h.name + '</option>' : ''; }).join('');
            return '<div class="rounded-2xl border border-slate-200 bg-slate-50 p-3 space-y-2">' +
                '<div class="flex items-center justify-between"><span class="text-sm font-black text-slate-800">' + child.name + '</span><span class="text-xs font-black text-amber-700">' + childState.lifetimeHatStars + ' 🎩</span></div>' +
                '<div class="text-[11px] text-slate-500">Current: <b>' + (current ? current.emoji + ' ' + current.name : 'No hat') + '</b>' + (next ? ' · Working towards <b>' + next.emoji + ' ' + next.name + '</b>' : '') + '</div>' +
                '<div class="grid grid-cols-1 md:grid-cols-2 gap-2">' +
                    '<select data-new-gus-hat-next="' + child.id + '" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white">' + options + '</select>' +
                    '<select data-new-gus-hat-wear-parent="' + child.id + '" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white">' + wearOptions + '</select>' +
                '</div>' +
            '</div>';
        }).join('');

        panel.innerHTML = '<h3 class="font-black text-slate-800 text-sm flex items-center gap-2">🎩 Gus Hat Rewards</h3><p class="text-xs text-slate-500 mt-1 mb-3">Choose which hat each child is working towards. Existing Gus Stars are untouched; Hat Stars start from zero when this feature is introduced.</p><div class="space-y-3">' + cards + '</div>';

        panel.querySelectorAll('[data-new-gus-hat-next]').forEach(function(select) {
            select.addEventListener('change', function() { newGusHatSetNextHat(select.getAttribute('data-new-gus-hat-next'), select.value || null); });
        });
        panel.querySelectorAll('[data-new-gus-hat-wear-parent]').forEach(function(select) {
            select.addEventListener('change', function() { newGusHatWear(select.getAttribute('data-new-gus-hat-wear-parent'), select.value || null); });
        });
    }

    // NEW: Refresh only the isolated hat feature.
    function newGusHatRefreshAll() {
        newGusHatEnsureStarted();
        var active = newGusHatActiveChild();
        if (active) {
            var state = newGusHatReadState();
            var childState = newGusHatEnsureChild(state, active.id, active.name);
            newGusHatWriteState(state);
            newGusHatRenderOnGus(childState);
            newGusHatRenderKidsPanel();
        }
        newGusHatRenderParentPanel();
    }

    // NEW: Capture existing star totals around the existing approval chain. No existing
    // approval function is altered; this wrapper only observes its before/after result.
    var newGusHatOriginalApproveChore = window.approveChore;
    if (typeof newGusHatOriginalApproveChore === 'function') {
        window.approveChore = function() {
            var childId = arguments.length ? arguments[0] : null;
            var beforeStates = newGusHatReadExistingStarStates();
            var before = beforeStates[childId] && Number(beforeStates[childId].totalStars);
            if (!Number.isFinite(before)) before = 0;
            var result = newGusHatOriginalApproveChore.apply(this, arguments);
            var afterStates = newGusHatReadExistingStarStates();
            var after = afterStates[childId] && Number(afterStates[childId].totalStars);
            if (!Number.isFinite(after)) after = before;
            if (after > before) {
                var childName = 'Child';
                try {
                    var child = window.getActiveChild && window.getActiveChild();
                    if (child && child.id === childId) childName = child.name;
                } catch (e) {}
                newGusHatRecordStarDelta(childId, childName, before, after);
            }
            return result;
        };
    }

    // NEW: Re-apply the hat layer after existing Gus rendering so it remains attached to Gus.
    var newGusHatOriginalKidsRender = window.renderKidsPortal;
    if (typeof newGusHatOriginalKidsRender === 'function') {
        window.renderKidsPortal = function() {
            var result = newGusHatOriginalKidsRender.apply(this, arguments);
            setTimeout(newGusHatRefreshAll, 0);
            return result;
        };
    }

    var newGusHatOriginalParentRender = window.renderParentPortal;
    if (typeof newGusHatOriginalParentRender === 'function') {
        window.renderParentPortal = function() {
            var result = newGusHatOriginalParentRender.apply(this, arguments);
            setTimeout(newGusHatRefreshAll, 0);
            return result;
        };
    }

    // NEW: Public helpers for future expansion and custom hat testing.
    window.petpalGusHatCatalogue = NEW_GUS_HAT_CATALOGUE;
    window.petpalGusHatSetNext = newGusHatSetNextHat;
    window.petpalGusHatWear = newGusHatWear;
    window.petpalGusHatRefresh = newGusHatRefreshAll;

    // NEW: Initialize without changing any existing PetPal state.
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(newGusHatRefreshAll, 0);
    });
})();

(function newGusHatPointAdjustmentSystem() {
    'use strict';

    // NEW: Reuse the existing isolated Hat Stars storage. No existing Gus Star data is changed.
    var NEW_GUS_HAT_POINT_STATE_KEY = 'petpalGusHatCollectionState';
    var NEW_GUS_HAT_POINT_PANEL_ID = 'newGusHatPointAdjustmentPanel';

    // NEW: Read the existing Hat Stars state directly from its isolated storage.
    function newGusHatPointReadState() {
        try {
            var raw = localStorage.getItem(NEW_GUS_HAT_POINT_STATE_KEY);
            var parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) {
            return {};
        }
    }

    // NEW: Write only the existing isolated hat collection state.
    function newGusHatPointWriteState(state) {
        try {
            localStorage.setItem(NEW_GUS_HAT_POINT_STATE_KEY, JSON.stringify(state));
            return true;
        } catch (e) {
            return false;
        }
    }

    // NEW: Resolve the existing child profiles without relying on lexical appData.
    function newGusHatPointGetChildren() {
        try {
            var raw = localStorage.getItem('petpal_app_data');
            var parsed = raw ? JSON.parse(raw) : null;
            return parsed && Array.isArray(parsed.children) ? parsed.children : [];
        } catch (e) {
            return [];
        }
    }

    // NEW: Adjust lifetime Hat Stars for testing. Hat Stars are lifetime progress, so reducing
    // the number does not revoke hats already unlocked; it only changes the current progress.
    function newGusHatPointSet(childId, value) {
        var numeric = Number(value);
        if (!Number.isFinite(numeric)) return false;
        numeric = Math.max(0, Math.floor(numeric));

        var state = newGusHatPointReadState();
        if (!state[childId] || typeof state[childId] !== 'object') {
            state[childId] = {
                childName: 'Child',
                lifetimeHatStars: 0,
                unlockedHatIds: [],
                currentHatId: null,
                nextHatId: null
            };
        }

        var childState = state[childId];
        if (!Array.isArray(childState.unlockedHatIds)) childState.unlockedHatIds = [];
        if (!Object.prototype.hasOwnProperty.call(childState, 'currentHatId')) childState.currentHatId = null;
        if (!Object.prototype.hasOwnProperty.call(childState, 'nextHatId')) childState.nextHatId = null;
        childState.lifetimeHatStars = numeric;

        if (!newGusHatPointWriteState(state)) return false;

        // NEW: Run the existing unlock check immediately so setting points to a requirement
        // can be used as a direct parent-side test of the hat system.
        try {
            if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh();
        } catch (e) {}

        // NEW: Refresh only the existing isolated hat UI.
        try {
            if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh();
        } catch (e) {}
        try {
            if (typeof window.renderParentPortal === 'function') window.renderParentPortal();
        } catch (e) {}
        return true;
    }

    // NEW: Add or remove one Hat Star for quick testing.
    function newGusHatPointNudge(childId, delta) {
        var state = newGusHatPointReadState();
        var current = state[childId] && Number(state[childId].lifetimeHatStars);
        if (!Number.isFinite(current)) current = 0;
        return newGusHatPointSet(childId, current + Number(delta || 0));
    }

    // NEW: Render a dedicated parent testing/adjustment card in the existing Settings tab.
    function newGusHatPointRender() {
        var host = document.getElementById('parentTabSettings');
        if (!host) return;

        var children = newGusHatPointGetChildren();
        if (!children.length) return;

        var state = newGusHatPointReadState();
        var panel = document.getElementById(NEW_GUS_HAT_POINT_PANEL_ID);
        if (!panel) {
            panel = document.createElement('div');
            panel.id = NEW_GUS_HAT_POINT_PANEL_ID;
            panel.className = 'bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm';
            host.insertBefore(panel, host.firstChild);
        }

        var cards = children.map(function(child) {
            var childState = state[child.id] || {};
            var total = Number(childState.lifetimeHatStars);
            if (!Number.isFinite(total)) total = 0;
            var nextText = childState.nextHatId ? String(childState.nextHatId).replace(/_/g, ' ') : 'No next hat selected';
            var unlockedCount = Array.isArray(childState.unlockedHatIds) ? childState.unlockedHatIds.length : 0;

            return '<div class="rounded-2xl border border-slate-200 bg-slate-50 p-3 space-y-2">' +
                '<div class="flex items-center justify-between gap-3">' +
                    '<span class="text-sm font-black text-slate-800">' + String(child.name || 'Child') + '</span>' +
                    '<span class="text-sm font-black text-amber-700">' + total + ' 🎩</span>' +
                '</div>' +
                '<div class="text-[11px] text-slate-500">Lifetime Hat Stars · ' + unlockedCount + ' hat(s) unlocked · Next: <b>' + nextText + '</b></div>' +
                '<div class="flex flex-wrap items-center gap-2">' +
                    '<button type="button" data-new-gus-hat-point-minus="' + child.id + '" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black">−1 🎩</button>' +
                    '<button type="button" data-new-gus-hat-point-plus="' + child.id + '" class="px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-xs font-black text-amber-800">+1 🎩</button>' +
                    '<input type="number" min="0" step="1" value="' + total + '" data-new-gus-hat-point-value="' + child.id + '" class="w-24 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white" aria-label="' + String(child.name || 'Child') + ' Hat Stars">' +
                    '<button type="button" data-new-gus-hat-point-save="' + child.id + '" class="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-black">Set Hat Stars</button>' +
                '</div>' +
            '</div>';
        }).join('');

        panel.innerHTML =
            '<h3 class="font-black text-slate-800 text-sm flex items-center gap-2">🎩 Adjust Hat Stars</h3>' +
            '<p class="text-xs text-slate-500 mt-1 mb-3">Parents can add, remove or set lifetime Hat Stars here. This is also a safe way to test a hat: choose a child’s next hat above, then set Hat Stars to its requirement. Hats already unlocked remain unlocked because this is a lifetime collection.</p>' +
            '<div class="space-y-3">' + cards + '</div>';

        panel.querySelectorAll('[data-new-gus-hat-point-plus]').forEach(function(button) {
            button.addEventListener('click', function() {
                newGusHatPointNudge(button.getAttribute('data-new-gus-hat-point-plus'), 1);
            });
        });
        panel.querySelectorAll('[data-new-gus-hat-point-minus]').forEach(function(button) {
            button.addEventListener('click', function() {
                newGusHatPointNudge(button.getAttribute('data-new-gus-hat-point-minus'), -1);
            });
        });
        panel.querySelectorAll('[data-new-gus-hat-point-save]').forEach(function(button) {
            button.addEventListener('click', function() {
                var childId = button.getAttribute('data-new-gus-hat-point-save');
                var input = panel.querySelector('[data-new-gus-hat-point-value="' + CSS.escape(childId) + '"]');
                if (!input) return;
                newGusHatPointSet(childId, input.value);
            });
        });
    }

    // NEW: Keep the isolated parent control current after existing Parent Portal renders.
    var newGusHatPointOriginalParentRender = window.renderParentPortal;
    if (typeof newGusHatPointOriginalParentRender === 'function') {
        window.renderParentPortal = function() {
            var result = newGusHatPointOriginalParentRender.apply(this, arguments);
            setTimeout(newGusHatPointRender, 0);
            return result;
        };
    }

    // NEW: Public helpers for controlled testing.
    window.petpalAdjustGusHatStars = newGusHatPointNudge;
    window.petpalSetGusHatStars = newGusHatPointSet;

    // NEW: Initial isolated render.
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(newGusHatPointRender, 0);
    });
})();

(function newGusHatCustomizationLayer() {
    'use strict';

    // NEW: Parent-editable lifetime Hat Star requirements are stored separately from
    // the original hat catalogue so the existing catalogue, functions and artwork
    // definitions remain untouched.
    var NEW_GUS_HAT_REQUIREMENT_OVERRIDES_KEY = 'petpalGusHatRequirementOverrides';
    var NEW_GUS_HAT_ART_OVERRIDES_KEY = 'petpalGusHatArtOverrides';
    var NEW_GUS_HAT_CUSTOM_PANEL_ID = 'newGusHatCustomizationPanel';

    // NEW: Read parent-defined requirement overrides.
    function newGusHatReadRequirementOverrides() {
        try {
            var raw = localStorage.getItem(NEW_GUS_HAT_REQUIREMENT_OVERRIDES_KEY);
            var parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) { return {}; }
    }

    // NEW: Get the effective requirement without changing the original catalogue object.
    function newGusHatEffectiveRequirement(hat) {
        if (!hat) return 0;
        var overrides = newGusHatReadRequirementOverrides();
        var value = Number(overrides[hat.id]);
        return Number.isFinite(value) && value >= 0 ? Math.floor(value) : Number(hat.requirement) || 0;
    }

    // NEW: Save one parent-defined requirement.
    function newGusHatSetRequirement(hatId, value) {
        if (!hatId) return false;
        var numeric = Number(value);
        if (!Number.isFinite(numeric) || numeric < 0) return false;
        var overrides = newGusHatReadRequirementOverrides();
        overrides[hatId] = Math.floor(numeric);
        try { localStorage.setItem(NEW_GUS_HAT_REQUIREMENT_OVERRIDES_KEY, JSON.stringify(overrides)); } catch (e) { return false; }
        newGusHatApplyEffectiveRequirementDisplay();
        newGusHatTryEffectiveUnlocks();
        return true;
    }

    // NEW: Restore a hat to its original catalogue requirement.
    function newGusHatResetRequirement(hatId) {
        var overrides = newGusHatReadRequirementOverrides();
        delete overrides[hatId];
        try { localStorage.setItem(NEW_GUS_HAT_REQUIREMENT_OVERRIDES_KEY, JSON.stringify(overrides)); } catch (e) {}
        newGusHatApplyEffectiveRequirementDisplay();
        newGusHatTryEffectiveUnlocks();
    }

    // NEW: Read optional custom SVG artwork supplied by the parent/developer.
    function newGusHatReadArtOverrides() {
        try {
            var raw = localStorage.getItem(NEW_GUS_HAT_ART_OVERRIDES_KEY);
            var parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) { return {}; }
    }

    // NEW: Set custom SVG markup for a hat. The markup is inserted as a child of Gus's
    // existing SVG layer, so all existing Gus animations continue to move the artwork.
    function newGusHatSetArt(hatId, svgMarkup) {
        if (!hatId || typeof svgMarkup !== 'string' || !svgMarkup.trim()) return false;
        var overrides = newGusHatReadArtOverrides();
        overrides[hatId] = svgMarkup;
        try { localStorage.setItem(NEW_GUS_HAT_ART_OVERRIDES_KEY, JSON.stringify(overrides)); } catch (e) { return false; }
        newGusHatRefreshCustomArt();
        return true;
    }

    // NEW: Remove custom artwork and return to the built-in SVG artwork.
    function newGusHatResetArt(hatId) {
        var overrides = newGusHatReadArtOverrides();
        delete overrides[hatId];
        try { localStorage.setItem(NEW_GUS_HAT_ART_OVERRIDES_KEY, JSON.stringify(overrides)); } catch (e) {}
        newGusHatRefreshCustomArt();
    }

    // NEW: Refresh Gus using the existing public hat refresh, which preserves the
    // existing animation chain and visual positioning.
    function newGusHatRefreshCustomArt() {
        try {
            if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh();
        } catch (e) {}
        setTimeout(function() {
            try {
                var stateRaw = localStorage.getItem('petpalGusHatCollectionState');
                var state = stateRaw ? JSON.parse(stateRaw) : {};
                var child = typeof window.getActiveChild === 'function' ? window.getActiveChild() : null;
                if (!child || !state[child.id] || !state[child.id].currentHatId) return;
                var override = newGusHatReadArtOverrides()[state[child.id].currentHatId];
                if (!override) return;
                var layer = document.getElementById('newGusHatSvgLayer');
                if (layer) layer.innerHTML = override;
            } catch (e) {}
        }, 0);
    }

    // NEW: Unlock using the parent-defined requirement. This runs alongside the existing
    // system rather than replacing any existing function.
    function newGusHatTryEffectiveUnlocks() {
        var state = {};
        try {
            var raw = localStorage.getItem('petpalGusHatCollectionState');
            state = raw ? JSON.parse(raw) : {};
        } catch (e) { state = {}; }

        var changed = false;
        Object.keys(state).forEach(function(childId) {
            var childState = state[childId];
            if (!childState || !childState.nextHatId) return;
            var hat = Array.isArray(window.petpalGusHatCatalogue) ? window.petpalGusHatCatalogue.find(function(h){ return h.id === childState.nextHatId; }) : null;
            if (!hat) return;
            var requirement = newGusHatEffectiveRequirement(hat);
            if (Number(childState.lifetimeHatStars) < requirement) return;
            if (!Array.isArray(childState.unlockedHatIds)) childState.unlockedHatIds = [];
            if (childState.unlockedHatIds.indexOf(hat.id) === -1) {
                childState.unlockedHatIds.push(hat.id);
                childState.currentHatId = hat.id;
                childState.nextHatId = null;
                changed = true;
                try { alert('🎉 Gus unlocked the ' + hat.name + '!'); } catch (e) {}
            }
        });
        if (changed) {
            try { localStorage.setItem('petpalGusHatCollectionState', JSON.stringify(state)); } catch (e) {}
            try { if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh(); } catch (e) {}
            newGusHatRefreshCustomArt();
        }
        return changed;
    }

    // NEW: Apply effective requirement text to the existing isolated hat UI without
    // changing its existing styling or structure.
    function newGusHatApplyEffectiveRequirementDisplay() {
        var overrides = newGusHatReadRequirementOverrides();
        var catalogue = Array.isArray(window.petpalGusHatCatalogue) ? window.petpalGusHatCatalogue : [];
        var panel = document.getElementById('newGusHatParentPanel');
        if (panel) {
            panel.querySelectorAll('select[data-new-gus-hat-next]').forEach(function(select) {
                Array.prototype.forEach.call(select.options, function(option) {
                    var hat = catalogue.find(function(h){ return h.id === option.value; });
                    if (!hat) return;
                    option.textContent = hat.emoji + ' ' + hat.name + ' — ' + newGusHatEffectiveRequirement(hat) + ' stars';
                });
            });
        }
    }

    // NEW: Render parent controls for changing each hat's requirement, while preserving
    // the existing Gus Hat Rewards panel and all of its controls.
    function newGusHatRenderCustomizationPanel() {
        var host = document.getElementById('parentTabSettings');
        if (!host || !Array.isArray(window.petpalGusHatCatalogue)) return;
        var panel = document.getElementById(NEW_GUS_HAT_CUSTOM_PANEL_ID);
        if (!panel) {
            panel = document.createElement('div');
            panel.id = NEW_GUS_HAT_CUSTOM_PANEL_ID;
            panel.className = 'bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm';
            host.insertBefore(panel, host.firstChild);
        }
        var overrides = newGusHatReadRequirementOverrides();
        var catalogue = window.petpalGusHatCatalogue;
        var rows = catalogue.map(function(hat) {
            var effective = newGusHatEffectiveRequirement(hat);
            var customised = Object.prototype.hasOwnProperty.call(overrides, hat.id);
            return '<div class="rounded-2xl border border-slate-200 bg-slate-50 p-3 flex flex-wrap items-center justify-between gap-3">' +
                '<div><div class="text-sm font-black text-slate-800">' + hat.emoji + ' ' + hat.name + '</div><div class="text-[11px] text-slate-500">Original: ' + hat.requirement + ' Hat Stars' + (customised ? ' · Custom: ' + effective : '') + '</div></div>' +
                '<div class="flex items-center gap-2"><input type="number" min="0" step="1" value="' + effective + '" data-new-gus-hat-requirement="' + hat.id + '" class="w-24 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white" aria-label="' + hat.name + ' Hat Star requirement"><button type="button" data-new-gus-hat-requirement-save="' + hat.id + '" class="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-black">Set</button><button type="button" data-new-gus-hat-requirement-reset="' + hat.id + '" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black">Reset</button></div>' +
                '</div>';
        }).join('');
        panel.innerHTML = '<h3 class="font-black text-slate-800 text-sm flex items-center gap-2">🎩 Hat Star Requirements</h3>' +
            '<p class="text-xs text-slate-500 mt-1 mb-3">Set the lifetime Hat Star value required for any hat. This is ideal for seasonal rewards — for example, set Halloween Hat to a lower value in October. Existing hats stay unlocked even if you later raise a requirement.</p>' +
            '<div class="space-y-2">' + rows + '</div>';
        panel.querySelectorAll('[data-new-gus-hat-requirement-save]').forEach(function(button) {
            button.addEventListener('click', function() {
                var id = button.getAttribute('data-new-gus-hat-requirement-save');
                var input = panel.querySelector('[data-new-gus-hat-requirement="' + CSS.escape(id) + '"]');
                if (input) newGusHatSetRequirement(id, input.value);
                newGusHatRenderCustomizationPanel();
            });
        });
        panel.querySelectorAll('[data-new-gus-hat-requirement-reset]').forEach(function(button) {
            button.addEventListener('click', function() {
                newGusHatResetRequirement(button.getAttribute('data-new-gus-hat-requirement-reset'));
                newGusHatRenderCustomizationPanel();
            });
        });
    }

    // NEW: Keep the custom controls synchronized with the existing Parent Portal.
    var newGusHatCustomizationOriginalParentRender = window.renderParentPortal;
    if (typeof newGusHatCustomizationOriginalParentRender === 'function') {
        window.renderParentPortal = function() {
            var result = newGusHatCustomizationOriginalParentRender.apply(this, arguments);
            setTimeout(function() {
                newGusHatRenderCustomizationPanel();
                newGusHatApplyEffectiveRequirementDisplay();
                newGusHatTryEffectiveUnlocks();
            }, 0);
            return result;
        };
    }

    // NEW: Re-check custom requirements after existing Hat Star changes and chore approvals.
    var newGusHatCustomizationOriginalSetPoints = window.petpalSetGusHatStars;
    if (typeof newGusHatCustomizationOriginalSetPoints === 'function') {
        window.petpalSetGusHatStars = function(childId, value) {
            var result = newGusHatCustomizationOriginalSetPoints(childId, value);
            newGusHatTryEffectiveUnlocks();
            return result;
        };
    }
    var newGusHatCustomizationOriginalApprove = window.approveChore;
    if (typeof newGusHatCustomizationOriginalApprove === 'function') {
        window.approveChore = function() {
            var result = newGusHatCustomizationOriginalApprove.apply(this, arguments);
            setTimeout(newGusHatTryEffectiveUnlocks, 0);
            return result;
        };
    }

    // NEW: Public API for supplying custom SVG artwork from your own assets/code.
    // The supplied SVG is rendered inside Gus's existing SVG, preserving all Gus animations.
    window.petpalSetGusHatArt = newGusHatSetArt;
    window.petpalResetGusHatArt = newGusHatResetArt;
    window.petpalSetGusHatRequirement = newGusHatSetRequirement;
    window.petpalResetGusHatRequirement = newGusHatResetRequirement;
    window.petpalGetGusHatRequirements = function() {
        var result = {};
        var catalogue = Array.isArray(window.petpalGusHatCatalogue) ? window.petpalGusHatCatalogue : [];
        catalogue.forEach(function(hat) { result[hat.id] = newGusHatEffectiveRequirement(hat); });
        return result;
    };

    // NEW: Initial isolated setup.
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            newGusHatRenderCustomizationPanel();
            newGusHatApplyEffectiveRequirementDisplay();
            newGusHatTryEffectiveUnlocks();
            newGusHatRefreshCustomArt();
        }, 0);
    });
})();

(function newGusEasyHatExpansionSystem() {
    'use strict';

    // NEW: ADD EXTRA HATS HERE.
    // Copy one object, give it a unique id, choose the name/emoji/requirement,
    // and paste your SVG artwork into the art field. The existing hat system will
    // automatically include the new hat in the parent and kids hat controls.
    // Artwork uses Gus's existing 200 x 200 SVG coordinate space.
    var NEW_GUS_EXTRA_HATS = [
        // NEW: Example — duplicate this object to add another Halloween hat.
        // {
        //     id: 'halloween_bat_hat',
        //     name: 'Halloween Bat Hat',
        //     emoji: '🦇',
        //     requirement: 25,
        //     type: 'Seasonal',
        //     art: '<g transform="translate(0 -2)"><path d="M62 46 Q72 27 100 25 Q128 27 138 46 Q119 42 100 48 Q81 42 62 46Z" fill="#111827" stroke="#030712" stroke-width="3"/><path d="M72 37 L80 18 L91 29 M128 37 L120 18 L109 29" fill="#7C3AED" stroke="#4C1D95" stroke-width="3"/><circle cx="92" cy="35" r="2" fill="#FDE68A"/><circle cx="108" cy="35" r="2" fill="#FDE68A"/></g>'
        // }
    ];

    // NEW: Return only valid, uniquely identified extra hats.
    function newGusExtraHatIsValid(hat) {
        return !!(hat && typeof hat.id === 'string' && hat.id.trim() &&
            typeof hat.name === 'string' && hat.name.trim() &&
            typeof hat.emoji === 'string' &&
            Number.isFinite(Number(hat.requirement)) && Number(hat.requirement) >= 0 &&
            typeof hat.art === 'string' && hat.art.trim());
    }

    // NEW: Convert a complete <svg> supplied by the parent/developer into inner SVG
    // markup where possible. Inner <g>/<path>/<circle> markup is also accepted directly.
    function newGusNormaliseHatArt(art) {
        if (typeof art !== 'string') return '';
        var trimmed = art.trim();
        if (!trimmed) return '';
        if (!/^<svg[\s>]/i.test(trimmed)) return trimmed;
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(trimmed, 'image/svg+xml');
            var svg = doc.documentElement;
            if (!svg || svg.nodeName.toLowerCase() !== 'svg') return trimmed;
            return Array.prototype.map.call(svg.childNodes, function(node) {
                return new XMLSerializer().serializeToString(node);
            }).join('');
        } catch (e) {
            return trimmed;
        }
    }

    // NEW: Add extra hats to the existing catalogue object without replacing the
    // original catalogue or changing any existing hat definitions/functions.
    function newGusRegisterExtraHats() {
        var catalogue = Array.isArray(window.petpalGusHatCatalogue) ? window.petpalGusHatCatalogue : null;
        if (!catalogue) return;

        NEW_GUS_EXTRA_HATS.forEach(function(hat) {
            if (!newGusExtraHatIsValid(hat)) return;
            if (catalogue.some(function(existing) { return existing.id === hat.id; })) return;
            catalogue.push({
                id: hat.id,
                name: hat.name,
                emoji: hat.emoji,
                requirement: Math.floor(Number(hat.requirement)),
                type: hat.type || 'Custom'
            });
        });
    }

    // NEW: Render custom expansion artwork after the existing Gus hat renderer.
    // The artwork is inserted inside the same #gusSvg layer used by the existing
    // hat system, so existing Gus animations continue to move the hat with Gus.
    function newGusRenderExtraHatArt() {
        try {
            var child = typeof window.getActiveChild === 'function' ? window.getActiveChild() : null;
            if (!child) return;
            var raw = localStorage.getItem('petpalGusHatCollectionState');
            var state = raw ? JSON.parse(raw) : {};
            var childState = state && state[child.id];
            var hatId = childState && childState.currentHatId;
            if (!hatId) return;
            var extra = NEW_GUS_EXTRA_HATS.find(function(h) { return h.id === hatId; });
            if (!extra) return;

            var gusSvg = document.getElementById('gusSvg');
            if (!gusSvg) return;
            var layer = document.getElementById('newGusHatSvgLayer');
            if (!layer) {
                layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                layer.setAttribute('id', 'newGusHatSvgLayer');
                layer.setAttribute('pointer-events', 'none');
                gusSvg.appendChild(layer);
            }
            layer.innerHTML = newGusNormaliseHatArt(extra.art);
        } catch (e) {}
    }

    // NEW: Keep the expansion artwork attached whenever the existing hat refresh runs.
    var newGusOriginalHatRefresh = window.petpalGusHatRefresh;
    if (typeof newGusOriginalHatRefresh === 'function') {
        window.petpalGusHatRefresh = function() {
            var result = newGusOriginalHatRefresh.apply(this, arguments);
            setTimeout(newGusRenderExtraHatArt, 0);
            return result;
        };
    }

    // NEW: Public helper for adding a hat dynamically during testing. This does not
    // replace the easy-to-edit catalogue above; it is simply an optional convenience.
    window.petpalAddGusHat = function(hat) {
        if (!newGusExtraHatIsValid(hat)) return false;
        var catalogue = Array.isArray(window.petpalGusHatCatalogue) ? window.petpalGusHatCatalogue : null;
        if (!catalogue || catalogue.some(function(existing) { return existing.id === hat.id; })) return false;
        catalogue.push({
            id: hat.id,
            name: hat.name,
            emoji: hat.emoji,
            requirement: Math.floor(Number(hat.requirement)),
            type: hat.type || 'Custom'
        });
        NEW_GUS_EXTRA_HATS.push(hat);
        try { if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh(); } catch (e) {}
        return true;
    };

    // NEW: Public helper to retrieve the recommended SVG artwork dimensions.
    window.petpalGusHatSvgTemplate = function() {
        return {
            viewBox: '0 0 200 200',
            width: 200,
            height: 200,
            note: 'Place hat artwork in the existing Gus 200x200 SVG coordinate space. You may supply a complete <svg viewBox="0 0 200 200">...</svg> or inner SVG markup.'
        };
    };

    // NEW: Register the extra catalogue entries after the existing hat system has loaded.
    newGusRegisterExtraHats();
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            newGusRegisterExtraHats();
            try { if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh(); } catch (e) {}
            setTimeout(newGusRenderExtraHatArt, 0);
        }, 0);
    });
})();

(function newGusGithubHatArtOverrideSystem() {
    'use strict';

    // NEW: Put replacement/custom SVG files in this folder in the same GitHub
    // repository as the PetPal HTML file. Relative paths also work with GitHub Pages.
    var NEW_GUS_HAT_ART_FOLDER = 'assets/gus/hats/';
    var NEW_GUS_HAT_ART_CACHE = {};
    var NEW_GUS_HAT_ART_LOADING = {};

    // NEW: Convert a complete SVG file into the inner SVG markup expected by Gus's
    // existing hat layer. The existing built-in artwork remains the fallback.
    function newGusGithubNormaliseSvg(svgText) {
        if (typeof svgText !== 'string' || !svgText.trim()) return '';
        var trimmed = svgText.trim();
        if (!/^<svg[\s>]/i.test(trimmed)) return trimmed;
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(trimmed, 'image/svg+xml');
            var svg = doc.documentElement;
            if (!svg || svg.nodeName.toLowerCase() !== 'svg') return '';
            return Array.prototype.map.call(svg.childNodes, function(node) {
                return new XMLSerializer().serializeToString(node);
            }).join('');
        } catch (e) {
            return '';
        }
    }

    // NEW: Safely turn a hat id into the matching filename. Hat ids in this app are
    // catalogue identifiers, so only simple filename characters are accepted.
    function newGusGithubHatFileName(hatId) {
        if (typeof hatId !== 'string' || !/^[A-Za-z0-9_-]+$/.test(hatId)) return '';
        return hatId + '.svg';
    }

    // NEW: Find the built-in artwork for a hat so a missing GitHub file never breaks
    // the existing hat system.
    function newGusGithubBuiltInArt(hatId) {
        try {
            if (typeof NEW_GUS_HAT_ART !== 'undefined' && NEW_GUS_HAT_ART[hatId]) {
                return NEW_GUS_HAT_ART[hatId];
            }
        } catch (e) {}
        return '';
    }

    // NEW: Read the parent's existing local SVG override first. This preserves the
    // v32/v33 testing API and means a local test artwork can take priority.
    function newGusGithubLocalArtOverride(hatId) {
        try {
            var raw = localStorage.getItem('petpalGusHatArtOverrides');
            var parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed[hatId] === 'string' ? parsed[hatId] : '';
        } catch (e) {
            return '';
        }
    }

    // NEW: Apply the selected artwork to the same SVG layer used by the existing
    // Gus hat renderer. Nothing is positioned outside Gus's SVG.
    function newGusGithubApplyArt(hatId, art) {
        if (!hatId || !art) return false;
        var layer = document.getElementById('newGusHatSvgLayer');
        if (!layer) return false;
        var normalised = newGusGithubNormaliseSvg(art);
        if (!normalised) return false;
        layer.innerHTML = normalised;
        return true;
    }

    // NEW: Fetch one SVG from the GitHub-hosted assets folder. A failed/missing file
    // is deliberately ignored so the original embedded artwork continues to work.
    function newGusGithubLoadArt(hatId, done) {
        if (!hatId) { if (done) done(''); return; }
        if (NEW_GUS_HAT_ART_CACHE[hatId]) { if (done) done(NEW_GUS_HAT_ART_CACHE[hatId]); return; }
        if (NEW_GUS_HAT_ART_LOADING[hatId]) {
            NEW_GUS_HAT_ART_LOADING[hatId].push(done);
            return;
        }
        NEW_GUS_HAT_ART_LOADING[hatId] = [done];
        var fileName = newGusGithubHatFileName(hatId);
        if (!fileName) {
            var invalidQueue = NEW_GUS_HAT_ART_LOADING[hatId] || [];
            delete NEW_GUS_HAT_ART_LOADING[hatId];
            invalidQueue.forEach(function(cb){ if (cb) cb(''); });
            return;
        }
        fetch(NEW_GUS_HAT_ART_FOLDER + fileName, { cache: 'no-cache' })
            .then(function(response) {
                if (!response.ok) throw new Error('Hat SVG not found');
                return response.text();
            })
            .then(function(text) {
                var normalised = newGusGithubNormaliseSvg(text);
                if (!normalised) throw new Error('Invalid hat SVG');
                NEW_GUS_HAT_ART_CACHE[hatId] = normalised;
                var queue = NEW_GUS_HAT_ART_LOADING[hatId] || [];
                delete NEW_GUS_HAT_ART_LOADING[hatId];
                queue.forEach(function(cb){ if (cb) cb(normalised); });
            })
            .catch(function() {
                var queue = NEW_GUS_HAT_ART_LOADING[hatId] || [];
                delete NEW_GUS_HAT_ART_LOADING[hatId];
                queue.forEach(function(cb){ if (cb) cb(''); });
            });
    }

    // NEW: Determine the active hat and apply artwork in this order:
    // 1) Parent/developer local override, 2) GitHub SVG, 3) built-in artwork.
    function newGusGithubRefreshActiveHat() {
        try {
            var child = typeof window.getActiveChild === 'function' ? window.getActiveChild() : null;
            if (!child) return;
            var raw = localStorage.getItem('petpalGusHatCollectionState');
            var state = raw ? JSON.parse(raw) : {};
            var childState = state && state[child.id];
            var hatId = childState && childState.currentHatId;
            if (!hatId) return;

            var localOverride = newGusGithubLocalArtOverride(hatId);
            if (localOverride) {
                newGusGithubApplyArt(hatId, localOverride);
                return;
            }

            var fallback = newGusGithubBuiltInArt(hatId);
            if (fallback) newGusGithubApplyArt(hatId, fallback);

            newGusGithubLoadArt(hatId, function(remoteArt) {
                if (!remoteArt) return;
                // NEW: Re-check the active hat before applying an asynchronous fetch,
                // preventing an old request from replacing a newly selected hat.
                try {
                    var latestRaw = localStorage.getItem('petpalGusHatCollectionState');
                    var latestState = latestRaw ? JSON.parse(latestRaw) : {};
                    var latestChildState = latestState && latestState[child.id];
                    if (latestChildState && latestChildState.currentHatId === hatId) {
                        newGusGithubApplyArt(hatId, remoteArt);
                    }
                } catch (e) {}
            });
        } catch (e) {}
    }

    // NEW: Re-run after the existing hat refresh. The original system remains the
    // owner of hat state and animation behaviour; this layer only supplies artwork.
    var newGusGithubOriginalRefresh = window.petpalGusHatRefresh;
    if (typeof newGusGithubOriginalRefresh === 'function') {
        window.petpalGusHatRefresh = function() {
            var result = newGusGithubOriginalRefresh.apply(this, arguments);
            setTimeout(newGusGithubRefreshActiveHat, 0);
            return result;
        };
    }

    // NEW: Public controls for testing and for future custom artwork workflows.
    window.petpalGusHatRefreshGithubArt = newGusGithubRefreshActiveHat;
    window.petpalGusHatArtFolder = NEW_GUS_HAT_ART_FOLDER;

    // NEW: Clear the in-memory cache after a replacement so a newly uploaded SVG can
    // be picked up without changing the catalogue or hat state.
    window.petpalGusHatReloadGithubArt = function(hatId) {
        if (hatId) delete NEW_GUS_HAT_ART_CACHE[hatId];
        else NEW_GUS_HAT_ART_CACHE = {};
        newGusGithubRefreshActiveHat();
    };

    // NEW: Initial setup after the existing PetPal UI is ready.
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(newGusGithubRefreshActiveHat, 0);
    });
})();

(function newGusHatUnlockAndClosetPositionPatch() {
    'use strict';

    // NEW: Resolve the effective Hat Star requirement, including any parent override.
    function newV35EffectiveHatRequirement(hat) {
        if (!hat) return 0;
        try {
            var raw = localStorage.getItem('petpalGusHatRequirementOverrides');
            var overrides = raw ? JSON.parse(raw) : {};
            var custom = Number(overrides && overrides[hat.id]);
            if (Number.isFinite(custom) && custom >= 0) return Math.floor(custom);
        } catch (e) {}
        var original = Number(hat.requirement);
        return Number.isFinite(original) && original >= 0 ? Math.floor(original) : 0;
    }

    // NEW: Directly re-check the selected next hat after parent Hat Star adjustments.
    // This is intentionally separate from the existing unlock functions so no existing
    // function, variable, catalogue or calculation is altered.
    function newV35TryHatUnlocks() {
        try {
            var catalogue = Array.isArray(window.petpalGusHatCatalogue) ? window.petpalGusHatCatalogue : [];
            var raw = localStorage.getItem('petpalGusHatCollectionState');
            var state = raw ? JSON.parse(raw) : {};
            var changed = false;

            Object.keys(state).forEach(function(childId) {
                var childState = state[childId];
                if (!childState || !childState.nextHatId) return;

                var hat = catalogue.find(function(item) { return item.id === childState.nextHatId; });
                if (!hat) return;

                var stars = Number(childState.lifetimeHatStars);
                if (!Number.isFinite(stars)) stars = 0;
                var requirement = newV35EffectiveHatRequirement(hat);
                if (stars < requirement) return;

                if (!Array.isArray(childState.unlockedHatIds)) childState.unlockedHatIds = [];
                if (childState.unlockedHatIds.indexOf(hat.id) !== -1) return;

                childState.unlockedHatIds.push(hat.id);
                childState.currentHatId = hat.id;
                childState.nextHatId = null;
                changed = true;

                try { alert('🎉 Gus unlocked the ' + hat.name + '!'); } catch (e) {}
            });

            if (changed) {
                localStorage.setItem('petpalGusHatCollectionState', JSON.stringify(state));
                try {
                    if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh();
                } catch (e) {}
                try {
                    if (typeof window.renderKidsPortal === 'function') window.renderKidsPortal();
                } catch (e) {}
                try {
                    if (typeof window.renderParentPortal === 'function') window.renderParentPortal();
                } catch (e) {}
            }
            return changed;
        } catch (e) {
            return false;
        }
    }

    // NEW: Make the existing public Hat Star testing helpers immediately trigger the
    // same unlock check after a parent adds, removes or sets Hat Stars.
    function newV35WrapHatPointHelper(name) {
        var original = window[name];
        if (typeof original !== 'function') return;
        window[name] = function() {
            var result = original.apply(this, arguments);
            setTimeout(newV35TryHatUnlocks, 0);
            return result;
        };
    }

    newV35WrapHatPointHelper('petpalSetGusHatStars');
    newV35WrapHatPointHelper('petpalAdjustGusHatStars');

    // NEW: The parent adjustment panel also calls its private setter directly. These
    // listeners cover the visible +1, -1 and Set buttons without modifying that setter.
    function newV35AttachHatPointTestListeners() {
        var panel = document.getElementById('newGusHatPointPanel');
        if (!panel || panel.getAttribute('data-v35-unlock-listeners') === 'true') return;
        panel.setAttribute('data-v35-unlock-listeners', 'true');
        panel.addEventListener('click', function(event) {
            var button = event.target.closest('[data-new-gus-hat-point-plus],[data-new-gus-hat-point-minus],[data-new-gus-hat-point-save]');
            if (!button) return;
            setTimeout(newV35TryHatUnlocks, 0);
        });
    }

    // NEW: Move the existing Kids Hat Closet from above the dashboard to directly
    // underneath Gus's existing visual card. No existing card, artwork or styling is
    // replaced; only the isolated hat panel's DOM position is changed.
    function newV35PositionKidsHatCloset() {
        var panel = document.getElementById('newGusHatPanel');
        var host = document.getElementById('kidsPortalView');
        if (!panel || !host) return;

        var grid = host.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12');
        if (!grid || !grid.children.length) return;

        var gusCard = grid.children[0];
        if (!gusCard) return;

        if (panel.parentElement !== gusCard) {
            gusCard.appendChild(panel);
        }

        // NEW: Keep the existing panel readable inside Gus's card without changing
        // its existing classes or visual design.
        panel.style.width = '100%';
    }

    // NEW: Replace the less exciting fallback message with the child-facing question.
    function newV35UpdateHatQuestion() {
        var panel = document.getElementById('newGusHatPanel');
        if (!panel) return;
        panel.querySelectorAll('.text-xs.font-bold.text-slate-600').forEach(function(node) {
            if (node.textContent.indexOf('Your parent will choose Gus') !== -1) {
                node.textContent = 'What hat will Gus get next?';
            }
        });
    }

    // NEW: Run the isolated adjustments after the existing hat UI has rendered.
    function newV35Refresh() {
        newV35AttachHatPointTestListeners();
        newV35TryHatUnlocks();
        newV35PositionKidsHatCloset();
        newV35UpdateHatQuestion();
    }

    // NEW: Re-apply after the existing Kids Portal render without replacing it.
    var newV35OriginalKidsRender = window.renderKidsPortal;
    if (typeof newV35OriginalKidsRender === 'function') {
        window.renderKidsPortal = function() {
            var result = newV35OriginalKidsRender.apply(this, arguments);
            setTimeout(newV35Refresh, 0);
            return result;
        };
    }

    // NEW: Re-apply after the existing Parent Portal render so the testing controls
    // remain live after any parent-side refresh.
    var newV35OriginalParentRender = window.renderParentPortal;
    if (typeof newV35OriginalParentRender === 'function') {
        window.renderParentPortal = function() {
            var result = newV35OriginalParentRender.apply(this, arguments);
            setTimeout(newV35Refresh, 0);
            return result;
        };
    }

    // NEW: Observe the isolated hat panel because the existing hat module may recreate
    // it during a render. This keeps its requested position stable without touching the
    // existing Gus or chore layout.
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            newV35Refresh();
            var host = document.getElementById('kidsPortalView');
            if (host && typeof MutationObserver !== 'undefined') {
                var observer = new MutationObserver(function() {
                    newV35PositionKidsHatCloset();
                    newV35UpdateHatQuestion();
                    newV35AttachHatPointTestListeners();
                });
                observer.observe(host, { childList: true, subtree: true });
            }
        }, 0);
    });

    // NEW: Public testing helper.
    window.petpalCheckGusHatUnlocks = newV35TryHatUnlocks;
})();

(function newV36GusHatReliabilityPatch() {
    'use strict';

    // NEW: Resolve the effective requirement, including the parent's custom value.
    function newV36GetRequirement(hat) {
        if (!hat) return 0;
        try {
            var raw = localStorage.getItem('petpalGusHatRequirementOverrides');
            var overrides = raw ? JSON.parse(raw) : {};
            var custom = Number(overrides && overrides[hat.id]);
            if (Number.isFinite(custom) && custom >= 0) return Math.floor(custom);
        } catch (e) {}
        var original = Number(hat.requirement);
        return Number.isFinite(original) && original >= 0 ? Math.floor(original) : 0;
    }

    // NEW: Read the live Hat Stars state and unlock the selected next hat immediately.
    function newV36CheckSelectedHatUnlocks() {
        try {
            var catalogue = Array.isArray(window.petpalGusHatCatalogue) ? window.petpalGusHatCatalogue : [];
            var raw = localStorage.getItem('petpalGusHatCollectionState');
            var state = raw ? JSON.parse(raw) : {};
            var changed = false;

            Object.keys(state).forEach(function(childId) {
                var childState = state[childId];
                if (!childState || !childState.nextHatId) return;

                var hat = catalogue.find(function(item) { return item.id === childState.nextHatId; });
                if (!hat) return;

                var stars = Number(childState.lifetimeHatStars);
                if (!Number.isFinite(stars)) stars = 0;
                var requirement = newV36GetRequirement(hat);
                if (stars < requirement) return;

                if (!Array.isArray(childState.unlockedHatIds)) childState.unlockedHatIds = [];
                if (childState.unlockedHatIds.indexOf(hat.id) !== -1) return;

                childState.unlockedHatIds.push(hat.id);
                childState.currentHatId = hat.id;
                childState.nextHatId = null;
                changed = true;

                try { alert('🎉 Gus unlocked the ' + hat.name + '!'); } catch (e) {}
            });

            if (changed) {
                localStorage.setItem('petpalGusHatCollectionState', JSON.stringify(state));
                try { if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh(); } catch (e) {}
                try { if (typeof window.renderKidsPortal === 'function') window.renderKidsPortal(); } catch (e) {}
                try { if (typeof window.renderParentPortal === 'function') window.renderParentPortal(); } catch (e) {}
            }
            return changed;
        } catch (e) {
            return false;
        }
    }

    // NEW: Wrap the final public Hat Star setters so every parent adjustment is followed
    // by an immediate unlock check, regardless of which earlier wrapper is active.
    function newV36WrapHatStarSetter(name) {
        var original = window[name];
        if (typeof original !== 'function' || original.__newV36Wrapped) return;
        var wrapped = function() {
            var result = original.apply(this, arguments);
            setTimeout(newV36CheckSelectedHatUnlocks, 0);
            return result;
        };
        wrapped.__newV36Wrapped = true;
        window[name] = wrapped;
    }

    newV36WrapHatStarSetter('petpalSetGusHatStars');
    newV36WrapHatStarSetter('petpalAdjustGusHatStars');

    // NEW: Position the Hat Closet directly beneath Gus's visual area inside the same
    // Gus card. This is more precise than relying on the card's first child position.
    function newV36PositionHatCloset() {
        var panel = document.getElementById('newGusHatPanel');
        var host = document.getElementById('kidsPortalView');
        if (!panel || !host) return;

        var gusCard = host.querySelector('.grid.grid-cols-1.lg\\:grid-cols-12 > div.lg\\:col-span-5');
        if (!gusCard) return;

        var gusVisual = gusCard.querySelector('.relative.w-48.h-48');
        if (gusVisual && gusVisual.nextElementSibling !== panel) {
            gusVisual.insertAdjacentElement('afterend', panel);
        } else if (!gusVisual && panel.parentElement !== gusCard) {
            gusCard.appendChild(panel);
        }

        panel.style.width = '100%';
    }

    // NEW: Ensure the child-facing wording is applied whenever the isolated panel redraws.
    function newV36UpdateHatQuestion() {
        var panel = document.getElementById('newGusHatPanel');
        if (!panel) return;
        panel.querySelectorAll('.text-xs.font-bold.text-slate-600').forEach(function(node) {
            if (node.textContent.indexOf('Your parent will choose Gus') !== -1) {
                node.textContent = 'What hat will Gus get next?';
            }
        });
    }

    // NEW: Keep the two isolated changes applied after any Kids Portal redraw.
    function newV36Refresh() {
        newV36CheckSelectedHatUnlocks();
        newV36PositionHatCloset();
        newV36UpdateHatQuestion();
    }

    // NEW: Wrap the current final Kids Portal renderer without changing its implementation.
    var newV36OriginalKidsRender = window.renderKidsPortal;
    if (typeof newV36OriginalKidsRender === 'function' && !newV36OriginalKidsRender.__newV36Wrapped) {
        var newV36KidsWrapped = function() {
            var result = newV36OriginalKidsRender.apply(this, arguments);
            setTimeout(newV36Refresh, 0);
            return result;
        };
        newV36KidsWrapped.__newV36Wrapped = true;
        window.renderKidsPortal = newV36KidsWrapped;
    }

    // NEW: Run once after the existing DOM is ready, then observe the Kids Portal because
    // the existing hat module recreates its panel during normal renders.
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            newV36Refresh();
            var host = document.getElementById('kidsPortalView');
            if (host && typeof MutationObserver !== 'undefined') {
                var observer = new MutationObserver(function() {
                    newV36PositionHatCloset();
                    newV36UpdateHatQuestion();
                });
                observer.observe(host, { childList: true, subtree: true });
            }
        }, 50);
    });

    // NEW: Public test helper for parent-side troubleshooting.
    window.petpalCheckGusHatUnlocks = newV36CheckSelectedHatUnlocks;
})();

(function newV37GusHatFinalReliabilityPatch() {
    'use strict';

    // NEW: Resolve the parent's custom requirement without changing the existing catalogue.
    function newV37GetRequirement(hat) {
        if (!hat) return 0;
        try {
            var raw = localStorage.getItem('petpalGusHatRequirementOverrides');
            var overrides = raw ? JSON.parse(raw) : {};
            var custom = Number(overrides && overrides[hat.id]);
            if (Number.isFinite(custom) && custom >= 0) return Math.floor(custom);
        } catch (e) {}
        var original = Number(hat.requirement);
        return Number.isFinite(original) && original >= 0 ? Math.floor(original) : 0;
    }

    // NEW: Unlock every explicitly selected next hat that the child already has enough
    // lifetime Hat Stars for. This is deliberately limited to the parent-selected hat,
    // preserving the existing "choose the next hat" design.
    function newV37UnlockSelectedNextHats() {
        try {
            var catalogue = Array.isArray(window.petpalGusHatCatalogue) ? window.petpalGusHatCatalogue : [];
            var raw = localStorage.getItem('petpalGusHatCollectionState');
            var state = raw ? JSON.parse(raw) : {};
            var changed = false;

            Object.keys(state).forEach(function(childId) {
                var childState = state[childId];
                if (!childState || !childState.nextHatId) return;

                var hat = catalogue.find(function(item) { return item.id === childState.nextHatId; });
                if (!hat) return;

                var stars = Number(childState.lifetimeHatStars);
                if (!Number.isFinite(stars)) stars = 0;
                var requirement = newV37GetRequirement(hat);
                if (stars < requirement) return;

                if (!Array.isArray(childState.unlockedHatIds)) childState.unlockedHatIds = [];
                if (childState.unlockedHatIds.indexOf(hat.id) !== -1) {
                    childState.nextHatId = null;
                    changed = true;
                    return;
                }

                childState.unlockedHatIds.push(hat.id);
                childState.currentHatId = hat.id;
                childState.nextHatId = null;
                changed = true;

                try { alert('🎉 Gus unlocked the ' + hat.name + '!'); } catch (e) {}
            });

            if (changed) {
                localStorage.setItem('petpalGusHatCollectionState', JSON.stringify(state));
                try { if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh(); } catch (e) {}
            }
            return changed;
        } catch (e) {
            return false;
        }
    }

    // NEW: After Hat Stars are changed, always refresh the isolated hat UI and then
    // perform the selected-hat unlock test. This also handles points that were set
    // before the parent selected a hat.
    function newV37RefreshAfterHatPointChange() {
        try { if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh(); } catch (e) {}
        setTimeout(function() {
            newV37UnlockSelectedNextHats();
            try { if (typeof window.renderKidsPortal === 'function') window.renderKidsPortal(); } catch (e) {}
            try { if (typeof window.renderParentPortal === 'function') window.renderParentPortal(); } catch (e) {}
        }, 0);
    }

    // NEW: Wrap both public Hat Star adjustment helpers so every visible parent control
    // immediately causes the hat collection and Kids View to refresh.
    function newV37WrapHatStarSetter(name) {
        var original = window[name];
        if (typeof original !== 'function' || original.__newV37Wrapped) return;
        var wrapped = function() {
            var result = original.apply(this, arguments);
            newV37RefreshAfterHatPointChange();
            return result;
        };
        wrapped.__newV37Wrapped = true;
        window[name] = wrapped;
    }

    newV37WrapHatStarSetter('petpalSetGusHatStars');
    newV37WrapHatStarSetter('petpalAdjustGusHatStars');

    // NEW: Selecting a hat after the child already has enough Hat Stars now unlocks it
    // immediately. This fixes the common testing sequence of "set points first, choose hat second".
    var newV37OriginalSetNext = window.petpalGusHatSetNext;
    if (typeof newV37OriginalSetNext === 'function' && !newV37OriginalSetNext.__newV37Wrapped) {
        var newV37WrappedSetNext = function() {
            var result = newV37OriginalSetNext.apply(this, arguments);
            setTimeout(function() {
                newV37UnlockSelectedNextHats();
                try { if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh(); } catch (e) {}
                try { if (typeof window.renderKidsPortal === 'function') window.renderKidsPortal(); } catch (e) {}
            }, 0);
            return result;
        };
        newV37WrappedSetNext.__newV37Wrapped = true;
        window.petpalGusHatSetNext = newV37WrappedSetNext;
    }

    // NEW: Ensure the existing Kids Hat Closet is rendered after the Kids Portal has
    // finished rebuilding. This does not replace the existing panel or its styling.
    function newV37EnsureKidsHatPanel() {
        try {
            if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh();
        } catch (e) {}
    }

    var newV37OriginalKidsRender = window.renderKidsPortal;
    if (typeof newV37OriginalKidsRender === 'function' && !newV37OriginalKidsRender.__newV37Wrapped) {
        var newV37WrappedKidsRender = function() {
            var result = newV37OriginalKidsRender.apply(this, arguments);
            setTimeout(function() {
                newV37UnlockSelectedNextHats();
                newV37EnsureKidsHatPanel();
            }, 0);
            return result;
        };
        newV37WrappedKidsRender.__newV37Wrapped = true;
        window.renderKidsPortal = newV37WrappedKidsRender;
    }

    // NEW: Initial check on page load covers saved Hat Stars and saved next-hat choices.
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            newV37UnlockSelectedNextHats();
            newV37EnsureKidsHatPanel();
        }, 50);
    });

    // NEW: Public diagnostic helper for testing from the browser console if required.
    window.petpalCheckGusHatUnlocksV37 = newV37UnlockSelectedNextHats;
})();

(function newV38DirectHatRewardReconciliation() {
    'use strict';

    // NEW: Read the same isolated Hat Stars state used by the existing hat system.
    function newV38ReadState() {
        try {
            var raw = localStorage.getItem('petpalGusHatCollectionState');
            var parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) {
            return {};
        }
    }

    // NEW: Write only the isolated Hat Stars/hat collection state.
    function newV38WriteState(state) {
        try {
            localStorage.setItem('petpalGusHatCollectionState', JSON.stringify(state));
            return true;
        } catch (e) {
            return false;
        }
    }

    // NEW: Read the effective parent-defined requirement, falling back to the catalogue value.
    function newV38GetRequirement(hat) {
        if (!hat) return 0;
        try {
            var raw = localStorage.getItem('petpalGusHatRequirementOverrides');
            var overrides = raw ? JSON.parse(raw) : {};
            var custom = Number(overrides && overrides[hat.id]);
            if (Number.isFinite(custom) && custom >= 0) return Math.floor(custom);
        } catch (e) {}
        var original = Number(hat.requirement);
        return Number.isFinite(original) && original >= 0 ? Math.floor(original) : 0;
    }

    // NEW: Resolve the live catalogue without copying or replacing it.
    function newV38GetCatalogue() {
        return Array.isArray(window.petpalGusHatCatalogue) ? window.petpalGusHatCatalogue : [];
    }

    // NEW: Reconcile one child's selected hat against the current Hat Star total.
    // This writes the same state shape used by the original isolated hat system.
    function newV38UnlockChild(childId, selectedHatId) {
        var state = newV38ReadState();
        var childState = state[childId];
        if (!childState) return false;

        // NEW: If the parent panel has a live selection, synchronise it before testing.
        if (selectedHatId !== undefined) childState.nextHatId = selectedHatId || null;
        if (!childState.nextHatId) return false;

        var catalogue = newV38GetCatalogue();
        var hat = catalogue.find(function(item) { return item.id === childState.nextHatId; });
        if (!hat) return false;

        var stars = Number(childState.lifetimeHatStars);
        if (!Number.isFinite(stars)) stars = 0;
        var requirement = newV38GetRequirement(hat);
        if (stars < requirement) {
            newV38WriteState(state);
            return false;
        }

        if (!Array.isArray(childState.unlockedHatIds)) childState.unlockedHatIds = [];
        var newlyUnlocked = childState.unlockedHatIds.indexOf(hat.id) === -1;
        if (newlyUnlocked) childState.unlockedHatIds.push(hat.id);
        childState.currentHatId = hat.id;
        childState.nextHatId = null;
        newV38WriteState(state);

        if (newlyUnlocked) {
            try { alert('🎉 Gus unlocked the ' + hat.name + '!'); } catch (e) {}
        }
        return true;
    }

    // NEW: Reconcile every child, using the actual Parent Portal hat selector when present.
    function newV38ReconcileAll() {
        var state = newV38ReadState();
        var panel = document.getElementById('newGusHatParentPanel');
        var changed = false;
        var catalogue = newV38GetCatalogue();
        if (!catalogue.length) return false;

        Object.keys(state).forEach(function(childId) {
            var childState = state[childId];
            if (!childState) return;

            var selectedHatId = undefined;
            if (panel) {
                var select = panel.querySelector('[data-new-gus-hat-next="' + CSS.escape(childId) + '"]');
                if (select) selectedHatId = select.value || null;
            }

            if (selectedHatId !== undefined && selectedHatId !== childState.nextHatId) {
                childState.nextHatId = selectedHatId;
                changed = true;
            }

            if (!childState.nextHatId) return;
            var hat = catalogue.find(function(item) { return item.id === childState.nextHatId; });
            if (!hat) return;

            var stars = Number(childState.lifetimeHatStars);
            if (!Number.isFinite(stars)) stars = 0;
            if (stars < newV38GetRequirement(hat)) return;

            if (!Array.isArray(childState.unlockedHatIds)) childState.unlockedHatIds = [];
            if (childState.unlockedHatIds.indexOf(hat.id) === -1) {
                childState.unlockedHatIds.push(hat.id);
                try { alert('🎉 Gus unlocked the ' + hat.name + '!'); } catch (e) {}
            }
            childState.currentHatId = hat.id;
            childState.nextHatId = null;
            changed = true;
        });

        if (changed) newV38WriteState(state);
        return changed;
    }

    // NEW: Refresh the existing isolated hat UI after reconciliation.
    function newV38RefreshHatUI() {
        try { if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh(); } catch (e) {}
        try { if (typeof window.renderKidsPortal === 'function') window.renderKidsPortal(); } catch (e) {}
        try { if (typeof window.renderParentPortal === 'function') window.renderParentPortal(); } catch (e) {}
    }

    // NEW: Listen directly on the Parent Portal so the fix does not depend on the order
    // of any earlier wrappers around the Hat Star controls.
    document.addEventListener('click', function(event) {
        var pointButton = event.target.closest('[data-new-gus-hat-point-plus],[data-new-gus-hat-point-minus],[data-new-gus-hat-point-save]');
        if (pointButton) {
            setTimeout(function() {
                if (newV38ReconcileAll()) newV38RefreshHatUI();
                else newV38RefreshHatUI();
            }, 0);
            return;
        }

        var nextHatSelect = event.target.closest('[data-new-gus-hat-next]');
        if (nextHatSelect) {
            setTimeout(function() {
                if (newV38ReconcileAll()) newV38RefreshHatUI();
            }, 0);
        }
    }, true);

    // NEW: A change event is the authoritative event for the Parent Portal hat selector.
    document.addEventListener('change', function(event) {
        var nextHatSelect = event.target.closest('[data-new-gus-hat-next]');
        if (!nextHatSelect) return;
        setTimeout(function() {
            var childId = nextHatSelect.getAttribute('data-new-gus-hat-next');
            var state = newV38ReadState();
            if (state[childId]) state[childId].nextHatId = nextHatSelect.value || null;
            newV38WriteState(state);
            if (newV38UnlockChild(childId, nextHatSelect.value || null)) newV38RefreshHatUI();
        }, 0);
    }, true);

    // NEW: Public diagnostic helper. It returns the live isolated hat state after reconciliation.
    window.petpalReconcileGusHatRewards = function() {
        var changed = newV38ReconcileAll();
        if (changed) newV38RefreshHatUI();
        return newV38ReadState();
    };

    // NEW: Check saved state once after the existing app has finished its initial render.
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            if (newV38ReconcileAll()) newV38RefreshHatUI();
        }, 250);
    });
})();

(function newGusHatArtworkReloadPanel() {
    'use strict';

    // NEW: Build a parent-only control card without changing the existing hat logic,
    // artwork, requirements, or layout outside this isolated addition.
    function newArtworkGetCatalogue() {
        try {
            if (typeof window.petpalGusHatCatalogue === 'function') {
                var catalogue = window.petpalGusHatCatalogue();
                if (Array.isArray(catalogue)) return catalogue;
            }
        } catch (e) {}
        return [];
    }

    // NEW: Reload one named hat. The existing v34+ GitHub artwork loader clears its
    // in-memory cache and then fetches the current SVG from GitHub Pages.
    function newArtworkReloadHat(hatId) {
        try {
            if (typeof window.petpalGusHatReloadGithubArt === 'function') {
                window.petpalGusHatReloadGithubArt(hatId);
            }
        } catch (e) {}
    }

    // NEW: Clear all cached external artwork, then refresh the currently active hat.
    function newArtworkReloadAll() {
        try {
            if (typeof window.petpalGusHatReloadGithubArt === 'function') {
                window.petpalGusHatReloadGithubArt();
            } else if (typeof window.petpalGusHatRefreshGithubArt === 'function') {
                window.petpalGusHatRefreshGithubArt();
            }
        } catch (e) {}
    }

    // NEW: Render a compact parent control card into the existing Settings tab.
    function newArtworkRenderPanel() {
        var host = document.getElementById('parentTabSettings');
        if (!host) return;

        var existing = document.getElementById('newGusHatArtworkReloadPanel');
        if (existing) existing.remove();

        var catalogue = newArtworkGetCatalogue();
        var panel = document.createElement('div');
        panel.id = 'newGusHatArtworkReloadPanel';
        panel.className = 'bg-white rounded-2xl shadow p-4 space-y-3';

        var title = document.createElement('div');
        title.className = 'font-bold text-lg';
        title.textContent = '🎨 Gus Hat Artwork';
        panel.appendChild(title);

        var intro = document.createElement('div');
        intro.className = 'text-sm text-gray-600';
        intro.innerHTML = 'Custom SVG artwork is loaded from <code>assets/gus/hats/</code> on your GitHub site. Replace an SVG there, then use Reload Artwork to fetch the new version.';
        panel.appendChild(intro);

        var reloadAll = document.createElement('button');
        reloadAll.type = 'button';
        reloadAll.className = 'px-4 py-2 rounded-xl font-semibold shadow';
        reloadAll.textContent = '🔄 Reload Current Hat Artwork';
        reloadAll.addEventListener('click', function() {
            newArtworkReloadAll();
        });
        panel.appendChild(reloadAll);

        var list = document.createElement('div');
        list.className = 'space-y-2';

        catalogue.forEach(function(hat) {
            if (!hat || !hat.id) return;
            var row = document.createElement('div');
            row.className = 'flex items-center justify-between gap-2 p-2 rounded-xl bg-gray-50';

            var label = document.createElement('div');
            label.className = 'text-sm';
            label.textContent = (hat.emoji || '🎩') + ' ' + (hat.name || hat.id) + ' — ' + hat.id + '.svg';
            row.appendChild(label);

            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'px-3 py-1 rounded-lg font-semibold shadow text-sm';
            button.textContent = 'Reload';
            button.addEventListener('click', function() {
                newArtworkReloadHat(hat.id);
            });
            row.appendChild(button);

            list.appendChild(row);
        });

        panel.appendChild(list);
        host.insertBefore(panel, host.firstChild || null);
    }

    // NEW: Re-render the isolated panel after the existing Parent Portal renders.
    var newArtworkOriginalRenderParent = window.renderParentPortal;
    if (typeof newArtworkOriginalRenderParent === 'function') {
        window.renderParentPortal = function() {
            var result = newArtworkOriginalRenderParent.apply(this, arguments);
            setTimeout(newArtworkRenderPanel, 0);
            return result;
        };
    }

    // NEW: Public helper for testing/custom workflows.
    window.petpalReloadGusHatArtwork = newArtworkReloadAll;

    // NEW: Initial panel setup after the existing UI is ready.
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(newArtworkRenderPanel, 0);
    });
})();

(function newGusReliableCustomHatArtReapplyPatch() {
    'use strict';

    // NEW: Read the currently worn hat directly from the isolated hat state.
    function newReliableReadCurrentHatId() {
        try {
            var child = typeof window.getActiveChild === 'function' ? window.getActiveChild() : null;
            if (!child || !child.id) return '';
            var raw = localStorage.getItem('petpalGusHatCollectionState');
            var state = raw ? JSON.parse(raw) : {};
            var childState = state && state[child.id];
            return childState && childState.currentHatId ? childState.currentHatId : '';
        } catch (e) {
            return '';
        }
    }

    // NEW: Ask the existing GitHub artwork system to apply the current custom SVG.
    // This deliberately reuses the existing loader/cache/fallback implementation.
    function newReliableApplyCurrentCustomArt() {
        try {
            var hatId = newReliableReadCurrentHatId();
            if (!hatId) return;
            if (typeof window.petpalGusHatRefreshGithubArt === 'function') {
                window.petpalGusHatRefreshGithubArt();
            }
        } catch (e) {}
    }

    // NEW: Reapply after the existing public refresh function. This catches refreshes
    // initiated by other isolated modules without modifying their original logic.
    var newReliableOriginalRefresh = window.petpalGusHatRefresh;
    if (typeof newReliableOriginalRefresh === 'function') {
        window.petpalGusHatRefresh = function() {
            var result = newReliableOriginalRefresh.apply(this, arguments);
            setTimeout(newReliableApplyCurrentCustomArt, 0);
            setTimeout(newReliableApplyCurrentCustomArt, 50);
            return result;
        };
    }

    // NEW: Directly wrap the public wear helper as an additional safety path. The
    // existing internal wear function remains untouched.
    var newReliableOriginalWear = window.petpalGusHatWear;
    if (typeof newReliableOriginalWear === 'function') {
        window.petpalGusHatWear = function() {
            var result = newReliableOriginalWear.apply(this, arguments);
            setTimeout(newReliableApplyCurrentCustomArt, 0);
            setTimeout(newReliableApplyCurrentCustomArt, 50);
            return result;
        };
    }

    // NEW: The Kids Closet uses the original internal wear function, so observe only
    // direct replacement of Gus's hat layer. When a new layer is inserted after a
    // hat change, the custom GitHub artwork is immediately reapplied.
    function newReliableObserveGusSvg() {
        var gusSvg = document.getElementById('gusSvg');
        if (!gusSvg || typeof MutationObserver === 'undefined') return;

        var observer = new MutationObserver(function(mutations) {
            var layerReplaced = mutations.some(function(mutation) {
                return Array.prototype.some.call(mutation.addedNodes || [], function(node) {
                    return node && node.nodeType === 1 && node.id === 'newGusHatSvgLayer';
                }) || Array.prototype.some.call(mutation.removedNodes || [], function(node) {
                    return node && node.nodeType === 1 && node.id === 'newGusHatSvgLayer';
                });
            });
            if (layerReplaced) {
                setTimeout(newReliableApplyCurrentCustomArt, 0);
                setTimeout(newReliableApplyCurrentCustomArt, 50);
            }
        });

        observer.observe(gusSvg, { childList: true });
    }

    // NEW: Also provide a direct public repair/reload helper for testing.
    window.petpalRepairGusHatArtwork = function() {
        newReliableApplyCurrentCustomArt();
        return newReliableReadCurrentHatId();
    };

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(newReliableObserveGusSvg, 250);
        setTimeout(newReliableApplyCurrentCustomArt, 500);
    });
})();

(function newV42NextHatProgressDisplay() {
    'use strict';

    // NEW: Read the existing lifetime Hat Stars state without changing its structure.
    function newV42ReadHatState() {
        try {
            var raw = localStorage.getItem('petpalGusHatCollectionState');
            var parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) {
            return {};
        }
    }

    // NEW: Read the parent-defined effective requirement for each hat.
    function newV42GetRequirement(hat) {
        if (!hat) return 0;
        try {
            var raw = localStorage.getItem('petpalGusHatRequirementOverrides');
            var overrides = raw ? JSON.parse(raw) : {};
            var custom = Number(overrides && overrides[hat.id]);
            if (Number.isFinite(custom) && custom >= 0) return Math.floor(custom);
        } catch (e) {}
        var original = Number(hat.requirement);
        return Number.isFinite(original) && original >= 0 ? Math.floor(original) : 0;
    }

    // NEW: Resolve the existing catalogue so requirements stay in one source of truth.
    function newV42GetCatalogue() {
        if (Array.isArray(window.petpalGusHatCatalogue)) return window.petpalGusHatCatalogue;
        return [];
    }

    // NEW: Find the active child from the same saved PetPal data used by the app.
    function newV42GetActiveChildId() {
        try {
            var raw = localStorage.getItem('petpal_app_data');
            var data = raw ? JSON.parse(raw) : null;
            if (data && Array.isArray(data.children) && data.children.length) {
                return data.activeChildId || data.children[0].id || null;
            }
        } catch (e) {}
        return null;
    }

    // NEW: Calculate the next genuinely unearned hat. Because Hat Stars now unlock
    // every hat at or below the child's total, this is the first requirement above it.
    function newV42GetNextHat(childState, catalogue) {
        if (!childState || !catalogue.length) return null;
        var stars = Number(childState.lifetimeHatStars);
        if (!Number.isFinite(stars)) stars = 0;

        var candidates = catalogue.map(function(hat, index) {
            return {
                hat: hat,
                requirement: newV42GetRequirement(hat),
                index: index
            };
        }).filter(function(item) {
            return childState.unlockedHatIds.indexOf(item.hat.id) === -1;
        });

        candidates.sort(function(a, b) {
            if (a.requirement !== b.requirement) return a.requirement - b.requirement;
            return a.index - b.index;
        });

        return candidates.length ? candidates[0] : null;
    }

    // NEW: Update the existing amber Next Hat card with a clear visual progress meter.
    // Existing styling classes are retained; only the displayed progress information is added.
    function newV42RenderNextHatProgress() {
        var panel = document.getElementById('newGusHatPanel');
        if (!panel) return;

        var childId = newV42GetActiveChildId();
        if (!childId) return;

        var state = newV42ReadHatState();
        var childState = state[childId];
        if (!childState) return;
        if (!Array.isArray(childState.unlockedHatIds)) childState.unlockedHatIds = [];

        var catalogue = newV42GetCatalogue();
        var next = newV42GetNextHat(childState, catalogue);
        var stars = Number(childState.lifetimeHatStars);
        if (!Number.isFinite(stars) || stars < 0) stars = 0;

        // NEW: Locate the existing Next Hat card by its heading rather than relying on DOM position.
        var cards = panel.querySelectorAll('div.rounded-2xl');
        var target = null;
        Array.prototype.forEach.call(cards, function(card) {
            if (target) return;
            var text = (card.textContent || '').trim();
            if (text.indexOf('Next Hat') !== -1 || text.indexOf("Your parent will choose Gus\'s next hat.") !== -1) {
                target = card;
            }
        });

        if (!target) {
            target = document.createElement('div');
            target.className = 'rounded-2xl bg-amber-50 border border-amber-200 p-3 mb-3';
            var collection = panel.querySelector('.flex.flex-wrap.gap-2');
            if (collection) panel.insertBefore(target, collection);
            else panel.appendChild(target);
        }

        if (!next) {
            target.innerHTML =
                '<div class="text-[10px] font-black uppercase tracking-wider text-amber-700">Hat Collection Complete</div>' +
                '<div class="text-sm font-black text-amber-900 mt-1">🎉 Gus has unlocked every hat!</div>' +
                '<div class="text-[11px] font-bold text-amber-700 mt-1">' + stars + ' Hat Stars earned</div>' +
                '<div class="h-2 bg-white rounded-full overflow-hidden mt-2 border border-amber-100"><div class="h-full bg-amber-400 rounded-full" style="width:100%"></div></div>';
            return;
        }

        var requirement = next.requirement;
        var remaining = Math.max(0, requirement - stars);
        var progress = requirement <= 0 ? 100 : Math.min(100, Math.round((stars / requirement) * 100));

        target.innerHTML =
            '<div class="text-[10px] font-black uppercase tracking-wider text-amber-700">Next Hat</div>' +
            '<div class="text-sm font-black text-amber-900 mt-1">' + next.hat.emoji + ' ' + next.hat.name + '</div>' +
            '<div class="flex items-center justify-between gap-2 mt-1">' +
                '<div class="text-[11px] font-bold text-amber-700">' + stars + ' / ' + requirement + ' Hat Stars</div>' +
                '<div class="text-[11px] font-black text-amber-800">' + remaining + ' to go!</div>' +
            '</div>' +
            '<div class="h-3 bg-white rounded-full overflow-hidden mt-2 border border-amber-100" aria-label="Hat progress: ' + progress + ' percent">' +
                '<div class="h-full bg-amber-400 rounded-full transition-all duration-300" style="width:' + progress + '%"></div>' +
            '</div>' +
            '<div class="text-[10px] font-bold text-amber-600 mt-1">Keep earning Hat Stars to unlock this hat.</div>';
    }

    // NEW: Re-render after the existing Kids Portal finishes building its Hat Closet.
    function newV42ScheduleProgress() {
        setTimeout(newV42RenderNextHatProgress, 0);
        setTimeout(newV42RenderNextHatProgress, 75);
    }

    // NEW: Wrap the public Kids Portal renderer without changing its original implementation.
    var newV42OriginalKidsRender = window.renderKidsPortal;
    if (typeof newV42OriginalKidsRender === 'function' && !newV42OriginalKidsRender.__newV42Wrapped) {
        var newV42WrappedKidsRender = function() {
            var result = newV42OriginalKidsRender.apply(this, arguments);
            newV42ScheduleProgress();
            return result;
        };
        newV42WrappedKidsRender.__newV42Wrapped = true;
        window.renderKidsPortal = newV42WrappedKidsRender;
    }

    // NEW: Keep the progress display current after Hat Star adjustment/testing controls.
    document.addEventListener('click', function(event) {
        if (event.target.closest('[data-new-gus-hat-point-plus],[data-new-gus-hat-point-minus],[data-new-gus-hat-point-save]')) {
            setTimeout(newV42RenderNextHatProgress, 100);
        }
    });

    // NEW: Public helper for testing or refreshing the visual independently.
    window.petpalRefreshGusHatProgress = newV42RenderNextHatProgress;

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(newV42RenderNextHatProgress, 150);
        setTimeout(newV42RenderNextHatProgress, 500);
    });
})();

// NEW: V43 RELIABLE PER-PROFILE GUS HAT PROGRESS DISPLAY PATCH
(function(){
    // NEW: Use the app's existing active-child helper so the progress display
    // always follows whichever child profile is currently selected.
    function newV43GetActiveChild(){
        try {
            if (typeof newGusHatActiveChild === 'function') return newGusHatActiveChild();
        } catch (e) {}
        try {
            if (typeof getActiveChild === 'function') return getActiveChild();
        } catch (e) {}
        return null;
    }

    // NEW: Read the current lifetime Hat Stars without changing stored data.
    function newV43ReadChildState(childId){
        try {
            var raw = localStorage.getItem('petpalGusHatCollectionState');
            var state = raw ? JSON.parse(raw) : {};
            var childState = state && state[childId] ? state[childId] : null;
            if (!childState) return null;
            if (!Array.isArray(childState.unlockedHatIds)) childState.unlockedHatIds = [];
            var stars = Number(childState.lifetimeHatStars);
            if (!Number.isFinite(stars) || stars < 0) stars = 0;
            childState.lifetimeHatStars = stars;
            return childState;
        } catch (e) {
            return null;
        }
    }

    // NEW: Respect the existing parent-set requirement override when calculating progress.
    function newV43GetRequirement(hat){
        var requirement = Number(hat && hat.requirement);
        try {
            var raw = localStorage.getItem('petpalGusHatRequirementOverrides');
            var overrides = raw ? JSON.parse(raw) : {};
            if (hat && overrides && Number.isFinite(Number(overrides[hat.id]))) {
                requirement = Math.max(0, Number(overrides[hat.id]));
            }
        } catch (e) {}
        return Number.isFinite(requirement) ? Math.max(0, requirement) : 0;
    }

    // NEW: Find the first hat the child has not yet unlocked, ordered by requirement.
    function newV43GetNextHat(childState){
        var catalogue = Array.isArray(window.petpalGusHatCatalogue) ? window.petpalGusHatCatalogue : [];
        if (!catalogue.length || !childState) return null;
        var candidates = catalogue.map(function(hat, index){
            return { hat: hat, requirement: newV43GetRequirement(hat), index: index };
        }).filter(function(item){
            return childState.unlockedHatIds.indexOf(item.hat.id) === -1;
        });
        candidates.sort(function(a,b){
            return a.requirement - b.requirement || a.index - b.index;
        });
        return candidates.length ? candidates[0] : null;
    }

    // NEW: Find the existing Next Hat area inside the Hat Closet and replace only its contents.
    function newV43RenderHatProgress(){
        var panel = document.getElementById('newGusHatPanel');
        if (!panel) return;

        var child = newV43GetActiveChild();
        if (!child || !child.id) return;

        var childState = newV43ReadChildState(child.id);
        if (!childState) return;

        var next = newV43GetNextHat(childState);
        var stars = childState.lifetimeHatStars;
        var target = null;
        var cards = panel.querySelectorAll('.rounded-2xl');
        Array.prototype.forEach.call(cards, function(card){
            if (target) return;
            var text = (card.textContent || '').trim();
            if (text.indexOf('Next Hat') !== -1 || text.indexOf('Your parent will choose Gus') !== -1) target = card;
        });

        if (!target) {
            target = document.createElement('div');
            target.className = 'rounded-2xl bg-amber-50 border border-amber-200 p-3 mb-3';
            var collection = panel.querySelector('.flex.flex-wrap.gap-2');
            if (collection) panel.insertBefore(target, collection);
            else panel.appendChild(target);
        }

        if (!next) {
            target.innerHTML =
                '<div class="text-[10px] font-black uppercase tracking-wider text-amber-700">Hat Collection Complete</div>' +
                '<div class="text-sm font-black text-amber-900 mt-1">🎉 Gus has unlocked every hat!</div>' +
                '<div class="text-[11px] font-bold text-amber-700 mt-1">' + stars + ' Hat Stars earned</div>' +
                '<div class="h-3 bg-white rounded-full overflow-hidden mt-2 border border-amber-100"><div class="h-full bg-amber-400 rounded-full" style="width:100%"></div></div>';
            return;
        }

        var requirement = next.requirement;
        var remaining = Math.max(0, requirement - stars);
        var percent = requirement <= 0 ? 100 : Math.min(100, Math.round((stars / requirement) * 100));
        target.innerHTML =
            '<div class="text-[10px] font-black uppercase tracking-wider text-amber-700">Next Hat</div>' +
            '<div class="text-sm font-black text-amber-900 mt-1">' + next.hat.emoji + ' ' + next.hat.name + '</div>' +
            '<div class="flex items-center justify-between gap-2 mt-1">' +
                '<div class="text-[11px] font-bold text-amber-700">' + stars + ' / ' + requirement + ' Hat Stars</div>' +
                '<div class="text-[11px] font-black text-amber-800">' + remaining + ' to go!</div>' +
            '</div>' +
            '<div class="h-3 bg-white rounded-full overflow-hidden mt-2 border border-amber-100" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + percent + '" aria-label="Progress towards ' + next.hat.name + '">' +
                '<div class="h-full bg-amber-400 rounded-full transition-all duration-300" style="width:' + percent + '%"></div>' +
            '</div>' +
            '<div class="text-[10px] font-bold text-amber-600 mt-1">Keep earning Hat Stars to unlock this hat.</div>';
    }

    // NEW: Run after the existing Hat Closet has rendered, including after profile switching.
    function newV43ScheduleHatProgress(){
        setTimeout(newV43RenderHatProgress, 0);
        setTimeout(newV43RenderHatProgress, 100);
        setTimeout(newV43RenderHatProgress, 300);
    }

    // NEW: Wrap the existing Kids Portal renderer without changing its implementation.
    var newV43OriginalRenderKids = window.renderKidsPortal;
    if (typeof newV43OriginalRenderKids === 'function' && !newV43OriginalRenderKids.__newV43HatProgressWrapped) {
        var newV43WrappedRenderKids = function(){
            var result = newV43OriginalRenderKids.apply(this, arguments);
            newV43ScheduleHatProgress();
            return result;
        };
        newV43WrappedRenderKids.__newV43HatProgressWrapped = true;
        window.renderKidsPortal = newV43WrappedRenderKids;
    }

    // NEW: Reapply after Hat Star testing/adjustment controls are used.
    document.addEventListener('click', function(event){
        if (event.target.closest('[data-new-gus-hat-point-plus],[data-new-gus-hat-point-minus],[data-new-gus-hat-point-save]')) {
            newV43ScheduleHatProgress();
        }
    });

    // NEW: Public refresh helper for testing.
    window.petpalRefreshGusHatProgress = newV43RenderHatProgress;

    document.addEventListener('DOMContentLoaded', function(){
        newV43ScheduleHatProgress();
    });
})();

// NEW: V44 EXPLICIT KIDS HAT PROGRESS CARD
// NEW: Adds a standalone, always-visible progress card inside each child's Gus Hat Closet.
// NEW: This intentionally does not depend on the existing "Next Hat" card or its DOM position.
(function(){
    function newV44GetChild(){
        try { if (typeof getActiveChild === 'function') return getActiveChild(); } catch (e) {}
        try {
            var raw = localStorage.getItem('petpal_app_data');
            var data = raw ? JSON.parse(raw) : null;
            if (!data || !Array.isArray(data.children) || !data.children.length) return null;
            var id = data.activeChildId || data.children[0].id;
            return data.children.find(function(c){ return c.id === id; }) || data.children[0];
        } catch (e) { return null; }
    }

    function newV44GetState(childId){
        try {
            var raw = localStorage.getItem('petpalGusHatCollectionState');
            var state = raw ? JSON.parse(raw) : {};
            var value = state && state[childId];
            if (!value) return { lifetimeHatStars: 0, unlockedHatIds: [] };
            return {
                lifetimeHatStars: Math.max(0, Number(value.lifetimeHatStars) || 0),
                unlockedHatIds: Array.isArray(value.unlockedHatIds) ? value.unlockedHatIds : []
            };
        } catch (e) { return { lifetimeHatStars: 0, unlockedHatIds: [] }; }
    }

    function newV44Requirement(hat){
        var requirement = Number(hat && hat.requirement);
        try {
            var raw = localStorage.getItem('petpalGusHatRequirementOverrides');
            var overrides = raw ? JSON.parse(raw) : {};
            if (hat && overrides && Number.isFinite(Number(overrides[hat.id]))) {
                requirement = Number(overrides[hat.id]);
            }
        } catch (e) {}
        return Number.isFinite(requirement) ? Math.max(0, Math.floor(requirement)) : 0;
    }

    function newV44GetNext(state){
        var catalogue = Array.isArray(window.petpalGusHatCatalogue) ? window.petpalGusHatCatalogue : [];
        var unlocked = state.unlockedHatIds || [];
        var candidates = catalogue.map(function(hat, index){
            return { hat: hat, requirement: newV44Requirement(hat), index: index };
        }).filter(function(item){ return unlocked.indexOf(item.hat.id) === -1; });
        candidates.sort(function(a,b){ return a.requirement - b.requirement || a.index - b.index; });
        return candidates.length ? candidates[0] : null;
    }

    function newV44Render(){
        var panel = document.getElementById('newGusHatPanel');
        if (!panel) return;
        var child = newV44GetChild();
        if (!child || !child.id) return;
        var state = newV44GetState(child.id);
        var next = newV44GetNext(state);
        var existing = panel.querySelector('[data-new-v44-hat-progress="true"]');
        if (!existing) {
            existing = document.createElement('div');
            existing.setAttribute('data-new-v44-hat-progress', 'true');
            existing.className = 'rounded-2xl bg-amber-50 border border-amber-200 p-3 mb-3';
            var first = panel.firstElementChild;
            if (first) panel.insertBefore(existing, first.nextSibling || first);
            else panel.appendChild(existing);
        }

        var stars = state.lifetimeHatStars;
        if (!next) {
            existing.innerHTML =
                '<div class="text-[10px] font-black uppercase tracking-wider text-amber-700">🎩 Hat Progress</div>' +
                '<div class="text-sm font-black text-amber-900 mt-1">🎉 Gus has unlocked every hat!</div>' +
                '<div class="text-[11px] font-bold text-amber-700 mt-1">' + stars + ' Hat Stars earned</div>' +
                '<div class="h-3 bg-white rounded-full overflow-hidden mt-2 border border-amber-100"><div class="h-full bg-amber-400 rounded-full" style="width:100%"></div></div>';
            return;
        }

        var requirement = next.requirement;
        var remaining = Math.max(0, requirement - stars);
        var percent = requirement <= 0 ? 100 : Math.min(100, Math.max(0, Math.round((stars / requirement) * 100)));
        existing.innerHTML =
            '<div class="flex items-center justify-between gap-2">' +
                '<div class="text-[10px] font-black uppercase tracking-wider text-amber-700">🎩 Hat Progress</div>' +
                '<div class="text-[10px] font-black text-amber-800">' + percent + '%</div>' +
            '</div>' +
            '<div class="text-sm font-black text-amber-900 mt-1">Next hat: ' + next.hat.emoji + ' ' + next.hat.name + '</div>' +
            '<div class="flex items-center justify-between gap-2 mt-1">' +
                '<div class="text-[11px] font-bold text-amber-700">' + stars + ' / ' + requirement + ' Hat Stars</div>' +
                '<div class="text-[11px] font-black text-amber-800">' + remaining + ' to go!</div>' +
            '</div>' +
            '<div class="h-3 bg-white rounded-full overflow-hidden mt-2 border border-amber-100" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + percent + '">' +
                '<div class="h-full bg-amber-400 rounded-full transition-all duration-300" style="width:' + percent + '%"></div>' +
            '</div>' +
            '<div class="text-[10px] font-bold text-amber-600 mt-1">Earn ' + remaining + ' more Hat Stars to win this hat.</div>';
    }

    function newV44Schedule(){
        setTimeout(newV44Render, 0);
        setTimeout(newV44Render, 150);
        setTimeout(newV44Render, 500);
    }

    // NEW: Wrap the current renderer so the standalone card is recreated after every profile render.
    var original = window.renderKidsPortal;
    if (typeof original === 'function' && !original.__newV44HatProgressWrapped) {
        var wrapped = function(){
            var result = original.apply(this, arguments);
            newV44Schedule();
            return result;
        };
        wrapped.__newV44HatProgressWrapped = true;
        window.renderKidsPortal = wrapped;
    }

    // NEW: Keep the card current after parent Hat Star adjustments.
    document.addEventListener('click', function(event){
        if (event.target.closest('[data-new-gus-hat-point-plus],[data-new-gus-hat-point-minus],[data-new-gus-hat-point-save]')) newV44Schedule();
    });

    window.petpalRefreshGusHatProgress = newV44Render;
    document.addEventListener('DOMContentLoaded', newV44Schedule);
})();

// NEW: ISOLATED RARE / SEASONAL GUS HATS SYSTEM
(function newGusRareHatEventSystem() {
    'use strict';

    // NEW: All rare-hat configuration lives in this isolated catalogue. To add a new
    // rare hat, duplicate one object and change only these fields. The SVG filename
    // should match the id and live in assets/gus/hats/ on the same GitHub site.
    var NEW_GUS_RARE_HAT_DEFINITIONS = [
        // NEW: Example seasonal hat. It is not active until a parent creates/saves an event.
        {
            id: 'halloween_rare_hat',
            name: 'Halloween Rare Hat',
            emoji: '🎃',
            type: 'seasonal',
            defaultRequirementType: 'challenge',
            defaultTarget: 5,
            defaultStart: '2026-10-01',
            defaultEnd: '2026-10-31',
            artFile: 'halloween_rare_hat.svg'
        }
    ];

    var NEW_GUS_RARE_EVENT_KEY = 'petpalGusRareHatEvents';
    var NEW_GUS_RARE_PROGRESS_KEY = 'petpalGusRareHatProgress';
    var NEW_GUS_RARE_REGISTERED_KEY = 'petpalGusRareHatRegistered';
    var NEW_GUS_RARE_PANEL_ID = 'newGusRareHatEventPanel';
    var NEW_GUS_RARE_KIDS_ID = 'newGusRareHatKidsPanel';
    var NEW_GUS_RARE_MAX_TARGET = 10000;

    // NEW: Supported requirement types. These are deliberately based on existing PetPal
    // activity so no existing chore/reward values are changed.
    var NEW_GUS_RARE_REQUIREMENT_TYPES = {
        challenge: 'Complete Gus Challenges',
        daily_goal: 'Reach Gus\'s Daily Goal',
        chores: 'Complete approved chores',
        gus_points: 'Earn Gus Points',
        hat_stars: 'Earn Hat Stars',
        manual: 'Parent awards the hat'
    };

    // NEW: Small helpers keep this module self-contained and avoid touching appData directly.
    function newRareRead(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return fallback;
            var parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : fallback;
        } catch (e) { return fallback; }
    }

    function newRareWrite(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
    }

    function newRareEscape(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function newRareTodayKey(date) {
        var d = date || new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function newRareDateFromValue(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return null;
        var d = new Date(String(value) + 'T12:00:00');
        return Number.isNaN(d.getTime()) ? null : d;
    }

    function newRareInWindow(dateKey, start, end) {
        var date = newRareDateFromValue(dateKey);
        var from = newRareDateFromValue(start);
        var to = newRareDateFromValue(end);
        if (!date || !from || !to) return false;
        return date >= from && date <= to;
    }

    function newRareGetChildren() {
        try {
            var raw = localStorage.getItem('petpal_app_data');
            var parsed = raw ? JSON.parse(raw) : null;
            return parsed && Array.isArray(parsed.children) ? parsed.children : [];
        } catch (e) { return []; }
    }

    function newRareDefinition(id) {
        return NEW_GUS_RARE_HAT_DEFINITIONS.find(function(item) { return item.id === id; }) || null;
    }

    function newRareGetEvents() { return newRareRead(NEW_GUS_RARE_EVENT_KEY, {}); }
    function newRareGetProgress() { return newRareRead(NEW_GUS_RARE_PROGRESS_KEY, {}); }

    // NEW: Event key is unique to child + rare hat so each child earns the same rare hat independently.
    function newRareEventKey(childId, hatId) { return String(childId) + '::' + String(hatId); }

    function newRareEnsureProgress(progress, childId, hatId) {
        var key = newRareEventKey(childId, hatId);
        if (!progress[key]) progress[key] = { value: 0, awarded: false, entries: [] };
        if (!Array.isArray(progress[key].entries)) progress[key].entries = [];
        progress[key].value = Math.max(0, Number(progress[key].value) || 0);
        progress[key].awarded = !!progress[key].awarded;
        return progress[key];
    }

    // NEW: Keep rare hats out of the normal Hat Star progression. They are only added to the
    // existing hat catalogue when actually won, so the existing "Next Hat" system is untouched.
    function newRareRegisterWonHat(definition) {
        if (!definition) return false;
        var registered = newRareRead(NEW_GUS_RARE_REGISTERED_KEY, {});
        if (Array.isArray(window.petpalGusHatCatalogue) && window.petpalGusHatCatalogue.some(function(hat) {
            return hat && hat.id === definition.id;
        })) {
            registered[definition.id] = true;
            newRareWrite(NEW_GUS_RARE_REGISTERED_KEY, registered);
            return true;
        }

        var add = window.petpalAddGusHat;
        if (typeof add !== 'function') return false;

        // NEW: Transparent placeholder ensures the existing SVG hat layer exists; the existing
        // GitHub artwork system then replaces it with assets/gus/hats/<id>.svg.
        var placeholder = '<g><rect x="0" y="0" width="1" height="1" fill="none" opacity="0"/></g>';
        var added = add({
            id: definition.id,
            name: definition.name,
            emoji: definition.emoji,
            requirement: 999999999,
            type: 'Rare',
            art: placeholder
        });
        if (!added && Array.isArray(window.petpalGusHatCatalogue)) {
            added = window.petpalGusHatCatalogue.some(function(hat) { return hat.id === definition.id; });
        }
        if (!added) return false;
        registered[definition.id] = true;
        newRareWrite(NEW_GUS_RARE_REGISTERED_KEY, registered);
        return true;
    }

    function newRareUnlockForChild(childId, definition, eventKey) {
        if (!definition) return false;
        if (!newRareRegisterWonHat(definition)) return false;

        var state = newRareRead('petpalGusHatCollectionState', {});
        if (!state[childId]) state[childId] = {
            childName: 'Child', lifetimeHatStars: 0, unlockedHatIds: [], currentHatId: null, nextHatId: null
        };
        if (!Array.isArray(state[childId].unlockedHatIds)) state[childId].unlockedHatIds = [];
        if (state[childId].unlockedHatIds.indexOf(definition.id) === -1) {
            state[childId].unlockedHatIds.push(definition.id);
        }
        newRareWrite('petpalGusHatCollectionState', state);

        var progress = newRareGetProgress();
        var record = newRareEnsureProgress(progress, childId, definition.id);
        record.awarded = true;
        newRareWrite(NEW_GUS_RARE_PROGRESS_KEY, progress);

        try { alert('🎉 ' + definition.name + ' unlocked! It is yours forever.'); } catch (e) {}
        try { if (typeof window.petpalGusHatRefresh === 'function') window.petpalGusHatRefresh(); } catch (e) {}
        try { if (typeof window.renderKidsPortal === 'function') window.renderKidsPortal(); } catch (e) {}
        return true;
    }

    function newRareGetEvent(childId, hatId) {
        var events = newRareGetEvents();
        return events[newRareEventKey(childId, hatId)] || null;
    }

    function newRareGetDefinitionForEvent(event) {
        return event ? newRareDefinition(event.hatId) : null;
    }

    function newRareTarget(event) {
        var target = Math.floor(Number(event && event.target));
        return Number.isFinite(target) && target >= 1 ? Math.min(target, NEW_GUS_RARE_MAX_TARGET) : 1;
    }

    function newRareRequirementLabel(type) {
        return NEW_GUS_RARE_REQUIREMENT_TYPES[type] || 'Special event';
    }

    function newRareProgressValue(childId, event) {
        if (!event) return 0;
        var progress = newRareGetProgress();
        var record = progress[newRareEventKey(childId, event.hatId)];
        return record ? Math.max(0, Number(record.value) || 0) : 0;
    }

    function newRareAwardIfReady(childId, event) {
        if (!event || !event.hatId || event.requirementType === 'manual') return false;
        var progress = newRareGetProgress();
        var record = newRareEnsureProgress(progress, childId, event.hatId);
        if (record.awarded) return false;
        if (newRareTarget(event) <= record.value) return newRareUnlockForChild(childId, newRareDefinition(event.hatId), newRareEventKey(childId, event.hatId));
        newRareWrite(NEW_GUS_RARE_PROGRESS_KEY, progress);
        return false;
    }

    // NEW: Increment a rare-event counter once per unique event entry. This prevents repeated
    // Parent Portal renders or duplicate approval wrappers from farming progress.
    function newRareIncrement(childId, event, amount, entryId) {
        if (!event || event.requirementType === 'manual') return false;
        if (!newRareInWindow(newRareTodayKey(), event.startDate, event.endDate)) return false;
        var numeric = Number(amount);
        if (!Number.isFinite(numeric) || numeric <= 0) return false;
        var progress = newRareGetProgress();
        var record = newRareEnsureProgress(progress, childId, event.hatId);
        if (entryId && record.entries.indexOf(String(entryId)) !== -1) return false;
        if (entryId) record.entries.push(String(entryId));
        record.value += numeric;
        record.value = Math.min(record.value, NEW_GUS_RARE_MAX_TARGET);
        newRareWrite(NEW_GUS_RARE_PROGRESS_KEY, progress);
        newRareAwardIfReady(childId, event);
        return true;
    }

    // NEW: Record approved chores and Gus Points for active rare events. Existing approval logic
    // still owns the chore, money, Gus Points and screen-time changes.
    function newRareRecordApproval(childId, choreId, day) {
        var children = newRareGetChildren();
        var child = children.find(function(item) { return String(item.id) === String(childId); });
        if (!child) return;
        var events = newRareGetEvents();
        Object.keys(events).forEach(function(key) {
            var event = events[key];
            if (!event || String(event.childId) !== String(childId)) return;
            var chore = Array.isArray(child.chores) ? child.chores.find(function(item) { return String(item.id) === String(choreId); }) : null;
            if (!chore) return;
            var dateKey = newRareTodayKey();
            var entryId = dateKey + '|' + String(choreId) + '|' + String(day || '');

            if (event.requirementType === 'chores' || event.requirementType === 'gus_points') {
                var amount = event.requirementType === 'gus_points' ? Number(chore.gusPointsReward || 0) : 1;
                newRareIncrement(childId, event, amount, entryId);
            }

            // NEW: A completed existing Gus Challenge also counts toward a rare-hat
            // challenge event. The ordinary challenge reward remains unchanged.
            if (event.requirementType === 'challenge') {
                try {
                    var rawChallenge = localStorage.getItem('gusDailyChallenges');
                    var challengeStore = rawChallenge ? JSON.parse(rawChallenge) : {};
                    var challenge = challengeStore && challengeStore[String(childId)];
                    if (challenge && challenge.date === dateKey && challenge.completed && String(challenge.choreId) === String(choreId)) {
                        newRareIncrement(childId, event, 1, 'challenge|' + entryId);
                    }
                } catch (e) {}
            }
        });
    }

    // NEW: Record completion of the existing daily Gus Goal using its saved daily history.
    function newRareScanDailyGoals() {
        var events = newRareGetEvents();
        var history = newRareRead('gusTargetDailyStarHistory', {});
        Object.keys(events).forEach(function(key) {
            var event = events[key];
            if (!event || event.requirementType !== 'daily_goal') return;
            var childHistory = history[String(event.childId)] || {};
            if (!childHistory || typeof childHistory !== 'object') return;
            Object.keys(childHistory).forEach(function(dateKey) {
                if (!newRareInWindow(dateKey, event.startDate, event.endDate)) return;
                var stars = Number(childHistory[dateKey] || 0);
                if (stars <= 0) return;
                newRareIncrement(event.childId, event, 1, 'daily-goal|' + event.childId + '|' + dateKey);
            });
        });
    }

    // NEW: Record Hat Stars earned during an event from the existing lifetime Hat Star state.
    function newRareScanHatStars() {
        var events = newRareGetEvents();
        var hatState = newRareRead('petpalGusHatCollectionState', {});
        Object.keys(events).forEach(function(key) {
            var event = events[key];
            if (!event || event.requirementType !== 'hat_stars') return;
            var childState = hatState[event.childId];
            if (!childState) return;
            var baseline = Number(event.baselineHatStars);
            if (!Number.isFinite(baseline)) {
                event.baselineHatStars = Number(childState.lifetimeHatStars) || 0;
                events[key] = event;
                newRareWrite(NEW_GUS_RARE_EVENT_KEY, events);
                baseline = event.baselineHatStars;
            }
            var current = Number(childState.lifetimeHatStars) || 0;
            if (current > baseline) {
                var amount = current - baseline;
                newRareIncrement(event.childId, event, amount, 'hat-stars|' + current);
            }
        });
    }

    // NEW: Parent can manually award a rare hat. This is useful for birthdays or one-off events.
    function newRareManualAward(childId, hatId) {
        var event = newRareGetEvent(childId, hatId);
        if (!event || event.requirementType !== 'manual') return false;
        return newRareUnlockForChild(childId, newRareDefinition(hatId), newRareEventKey(childId, hatId));
    }

    // NEW: Save one child's rare-hat event configuration without touching any existing PetPal data.
    function newRareSaveEvent(childId, hatId, requirementType, target, startDate, endDate) {
        var definition = newRareDefinition(hatId);
        if (!definition) return false;
        var type = Object.prototype.hasOwnProperty.call(NEW_GUS_RARE_REQUIREMENT_TYPES, requirementType) ? requirementType : definition.defaultRequirementType;
        var numericTarget = Math.max(1, Math.min(NEW_GUS_RARE_MAX_TARGET, Math.floor(Number(target) || definition.defaultTarget || 1)));
        var start = newRareDateFromValue(startDate) ? String(startDate) : definition.defaultStart;
        var end = newRareDateFromValue(endDate) ? String(endDate) : definition.defaultEnd;
        if (newRareDateFromValue(start) > newRareDateFromValue(end)) return false;
        var events = newRareGetEvents();
        var key = newRareEventKey(childId, hatId);
        var existing = events[key] || {};
        events[key] = {
            childId: String(childId),
            hatId: hatId,
            requirementType: type,
            target: type === 'manual' ? 1 : numericTarget,
            startDate: start,
            endDate: end,
            baselineHatStars: Object.prototype.hasOwnProperty.call(existing, 'baselineHatStars') ? existing.baselineHatStars : null,
            enabled: true
        };
        newRareWrite(NEW_GUS_RARE_EVENT_KEY, events);
        newRareScanDailyGoals();
        newRareScanHatStars();
        newRareRenderAll();
        return true;
    }

    function newRareRemoveEvent(childId, hatId) {
        var events = newRareGetEvents();
        delete events[newRareEventKey(childId, hatId)];
        newRareWrite(NEW_GUS_RARE_EVENT_KEY, events);
        newRareRenderAll();
    }

    // NEW: Parent Portal controls. This is a new standalone card; existing Settings/Manage UI is untouched.
    function newRareRenderParentPanel() {
        var host = document.getElementById('parentTabSettings');
        if (!host) return;
        var children = newRareGetChildren();
        if (!children.length) return;
        var panel = document.getElementById(NEW_GUS_RARE_PANEL_ID);
        if (!panel) {
            panel = document.createElement('div');
            panel.id = NEW_GUS_RARE_PANEL_ID;
            panel.className = 'bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm';
            host.appendChild(panel);
        }

        var events = newRareGetEvents();
        var definitions = NEW_GUS_RARE_HAT_DEFINITIONS;
        var childBlocks = children.map(function(child) {
            var active = definitions.map(function(definition) {
                var event = events[newRareEventKey(child.id, definition.id)] || {};
                var selectedType = event.requirementType || definition.defaultRequirementType;
                var selectedTarget = event.target || definition.defaultTarget;
                var selectedStart = event.startDate || definition.defaultStart;
                var selectedEnd = event.endDate || definition.defaultEnd;
                var progress = newRareProgressValue(child.id, event);
                var enabled = !!event.enabled;
                return '<div class="rounded-2xl border border-slate-200 bg-slate-50 p-3 mt-3">' +
                    '<div class="flex items-center justify-between gap-3"><div class="text-sm font-black text-slate-800">' + newRareEscape(definition.emoji + ' ' + definition.name) + '</div>' +
                    '<span class="text-[10px] font-extrabold ' + (enabled ? 'text-emerald-600' : 'text-slate-400') + '">' + (enabled ? 'ACTIVE' : 'NOT ACTIVE') + '</span></div>' +
                    '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">' +
                        '<select data-rare-type="' + newRareEscape(child.id + '|' + definition.id) + '" class="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white">' +
                            Object.keys(NEW_GUS_RARE_REQUIREMENT_TYPES).map(function(type) { return '<option value="' + type + '" ' + (type === selectedType ? 'selected' : '') + '>' + newRareEscape(newRareRequirementLabel(type)) + '</option>'; }).join('') +
                        '</select>' +
                        '<input type="number" min="1" step="1" value="' + newRareEscape(selectedTarget) + '" data-rare-target="' + newRareEscape(child.id + '|' + definition.id) + '" class="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white" />' +
                        '<label class="text-[10px] font-bold text-slate-500">Start <input type="date" value="' + newRareEscape(selectedStart) + '" data-rare-start="' + newRareEscape(child.id + '|' + definition.id) + '" class="block w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white" /></label>' +
                        '<label class="text-[10px] font-bold text-slate-500">End <input type="date" value="' + newRareEscape(selectedEnd) + '" data-rare-end="' + newRareEscape(child.id + '|' + definition.id) + '" class="block w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white" /></label>' +
                    '</div>' +
                    '<div class="flex flex-wrap items-center gap-2 mt-3">' +
                        '<button type="button" data-rare-save="' + newRareEscape(child.id + '|' + definition.id) + '" class="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black">Save Event</button>' +
                        (enabled ? '<button type="button" data-rare-remove="' + newRareEscape(child.id + '|' + definition.id) + '" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700">Turn Off</button>' : '') +
                        (enabled && selectedType === 'manual' ? '<button type="button" data-rare-award="' + newRareEscape(child.id + '|' + definition.id) + '" class="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-black">Award Hat</button>' : '') +
                        '<span class="text-[10px] font-bold text-slate-500">Progress: ' + Math.min(progress, newRareTarget(event)) + ' / ' + (selectedType === 'manual' ? 'manual' : selectedTarget) + '</span>' +
                    '</div>' +
                '</div>';
            }).join('');
            return '<div class="border-t border-slate-100 pt-4 mt-4"><div class="text-xs font-extrabold text-slate-800">' + newRareEscape(child.name || 'Child') + '</div>' + active + '</div>';
        }).join('');

        panel.innerHTML = '<h3 class="font-black text-slate-800 text-sm flex items-center gap-2">✨ Rare Hats & Events</h3>' +
            '<p class="text-xs text-slate-500 mt-1">Create seasonal or special hat events. The event opportunity expires on the end date, but a hat that is won stays unlocked forever.</p>' +
            childBlocks;

        panel.querySelectorAll('[data-rare-save]').forEach(function(button) {
            button.addEventListener('click', function() {
                var parts = button.getAttribute('data-rare-save').split('|');
                var childId = parts[0], hatId = parts[1];
                var type = panel.querySelector('[data-rare-type="' + CSS.escape(childId + '|' + hatId) + '"]').value;
                var target = panel.querySelector('[data-rare-target="' + CSS.escape(childId + '|' + hatId) + '"]').value;
                var start = panel.querySelector('[data-rare-start="' + CSS.escape(childId + '|' + hatId) + '"]').value;
                var end = panel.querySelector('[data-rare-end="' + CSS.escape(childId + '|' + hatId) + '"]').value;
                if (!newRareSaveEvent(childId, hatId, type, target, start, end)) alert('Please check the rare-hat event settings.');
            });
        });
        panel.querySelectorAll('[data-rare-award]').forEach(function(button) {
            button.addEventListener('click', function() {
                var parts = button.getAttribute('data-rare-award').split('|');
                if (!newRareManualAward(parts[0], parts[1])) alert('Please save the event as a manual rare-hat event first.');
            });
        });
        panel.querySelectorAll('[data-rare-remove]').forEach(function(button) {
            button.addEventListener('click', function() {
                var parts = button.getAttribute('data-rare-remove').split('|');
                newRareRemoveEvent(parts[0], parts[1]);
            });
        });
    }

    // NEW: Kids Portal card. It is added as a separate feature card and does not replace any
    // existing chore, Gus, Hat Closet, or profile UI.
    function newRareRenderKidsPanel() {
        var host = document.getElementById('kidsPortalView');
        if (!host || (typeof appData !== 'undefined' && appData.isParentMode)) return;
        var child = null;
        try { child = typeof getActiveChild === 'function' ? getActiveChild() : null; } catch (e) {}
        if (!child) return;

        var events = newRareGetEvents();
        var activeEvents = NEW_GUS_RARE_HAT_DEFINITIONS.map(function(definition) {
            var event = events[newRareEventKey(child.id, definition.id)];
            if (!event || !event.enabled) return null;
            if (!newRareInWindow(newRareTodayKey(), event.startDate, event.endDate)) return null;
            return { definition: definition, event: event, progress: newRareProgressValue(child.id, event) };
        }).filter(Boolean);

        var panel = document.getElementById(NEW_GUS_RARE_KIDS_ID);
        if (!activeEvents.length) {
            if (panel) panel.remove();
            return;
        }
        if (!panel) {
            panel = document.createElement('div');
            panel.id = NEW_GUS_RARE_KIDS_ID;
            panel.className = 'bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm';
            host.insertBefore(panel, host.firstElementChild || null);
        }

        panel.innerHTML = '<div class="flex items-center justify-between gap-3 mb-3"><div><h3 class="font-black text-slate-800 text-base flex items-center gap-2">✨ Rare Hats & Events</h3><p class="text-xs text-slate-500 mt-1">Special hats you can win during a limited-time event.</p></div><span class="text-lg">🏆</span></div>' +
            activeEvents.map(function(item) {
                var target = newRareTarget(item.event);
                var progress = Math.min(target, item.progress);
                var percent = target ? Math.min(100, Math.round((progress / target) * 100)) : 0;
                var remaining = Math.max(0, target - progress);
                var manual = item.event.requirementType === 'manual';
                return '<div class="rounded-2xl bg-amber-50 border border-amber-200 p-3 mt-3">' +
                    '<div class="text-[10px] font-black uppercase tracking-wider text-amber-700">✨ Rare Hat Event</div>' +
                    '<div class="text-sm font-black text-amber-900 mt-1">' + newRareEscape(item.definition.emoji + ' ' + item.definition.name) + '</div>' +
                    '<div class="text-[11px] font-bold text-amber-700 mt-1">' + (manual ? 'A special hat chosen by your parent.' : newRareEscape(newRareRequirementLabel(item.event.requirementType)) + ' — ' + progress + ' / ' + target) + '</div>' +
                    (!manual ? '<div class="h-3 bg-white rounded-full overflow-hidden mt-2 border border-amber-100"><div class="h-full bg-amber-400 rounded-full" style="width:' + percent + '%"></div></div><div class="text-[10px] font-bold text-amber-700 mt-1">' + (remaining ? remaining + ' more to win it!' : '🎉 Ready to win!') + '</div>' : '') +
                    '<div class="text-[10px] font-bold text-slate-500 mt-2">Event ends ' + newRareEscape(item.event.endDate) + '. If you win it, the hat is yours forever.</div>' +
                '</div>';
            }).join('');
    }

    // NEW: Approval wrapper only observes completed approvals and records isolated rare-event progress.
    var newRarePreviousApprove = window.approveChore;
    if (typeof newRarePreviousApprove === 'function' && !newRarePreviousApprove.__newRareHatWrapped) {
        var newRareWrappedApprove = function() {
            var args = arguments;
            var result = newRarePreviousApprove.apply(this, args);
            try { newRareRecordApproval(args[0], args[1], args[2]); } catch (e) {}
            setTimeout(newRareRenderAll, 0);
            return result;
        };
        newRareWrappedApprove.__newRareHatWrapped = true;
        window.approveChore = newRareWrappedApprove;
    }

    // NEW: Scan existing daily-goal and Hat-Star history whenever the feature renders.
    function newRareScanAll() {
        newRareScanDailyGoals();
        newRareScanHatStars();
    }

    function newRareRenderAll() {
        newRareScanAll();
        newRareRenderParentPanel();
        newRareRenderKidsPanel();
    }

    // NEW: Public helpers for parents/testing and future event controls.
    window.petpalGusRareHatDefinitions = NEW_GUS_RARE_HAT_DEFINITIONS;
    window.petpalCreateGusRareHatEvent = newRareSaveEvent;
    window.petpalRemoveGusRareHatEvent = newRareRemoveEvent;
    window.petpalAwardGusRareHat = newRareManualAward;
    window.petpalRefreshGusRareHats = newRareRenderAll;

    // NEW: Re-render after the existing portal renderers without changing their behaviour.
    var newRarePreviousKidsRender = window.renderKidsPortal;
    if (typeof newRarePreviousKidsRender === 'function' && !newRarePreviousKidsRender.__newRareHatWrapped) {
        var newRareKidsWrapped = function() {
            var result = newRarePreviousKidsRender.apply(this, arguments);
            setTimeout(newRareRenderKidsPanel, 0);
            return result;
        };
        newRareKidsWrapped.__newRareHatWrapped = true;
        window.renderKidsPortal = newRareKidsWrapped;
    }

    var newRarePreviousParentRender = window.renderParentPortal;
    if (typeof newRarePreviousParentRender === 'function' && !newRarePreviousParentRender.__newRareHatWrapped) {
        var newRareParentWrapped = function() {
            var result = newRarePreviousParentRender.apply(this, arguments);
            setTimeout(newRareRenderParentPanel, 0);
            return result;
        };
        newRareParentWrapped.__newRareHatWrapped = true;
        window.renderParentPortal = newRareParentWrapped;
    }

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(newRareRenderAll, 300);
    });
})();

// NEW: V46 RARE HAT REWARD SELECTOR
// NEW: Lets the parent choose exactly which rare hat each child can win for an event.
// NEW: One active event is configured per child. Winning the selected hat adds it to the
// NEW: child's permanent Gus Hat Closet; missing the event does not award the hat.
(function newGusRareHatRewardSelectorV46() {
    'use strict';

    // STAGE 16 FIX: keep the V46 reward selector in its own host so V45 cannot overwrite it.
    var PANEL_ID = 'newGusRareHatRewardSelectorPanelV46';
    var EVENTS_KEY = 'petpalGusRareHatEvents';
    var DEFINITIONS_KEY = 'petpalGusRareHatDefinitions';
    var SELECTIONS_KEY = 'petpalGusRareHatEventSelections';
    var PROGRESS_KEY = 'petpalGusRareHatProgress';

    function read(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return fallback;
            var parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : fallback;
        } catch (e) { return fallback; }
    }

    function write(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function todayKey() {
        var d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function dateValue(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return null;
        var d = new Date(String(value) + 'T12:00:00');
        return Number.isNaN(d.getTime()) ? null : d;
    }

    function inWindow(dateKey, start, end) {
        var d = dateValue(dateKey), s = dateValue(start), e = dateValue(end);
        return !!(d && s && e && d >= s && d <= e);
    }

    function getChildren() {
        try {
            var raw = localStorage.getItem('petpal_app_data');
            var data = raw ? JSON.parse(raw) : null;
            return data && Array.isArray(data.children) ? data.children : [];
        } catch (e) { return []; }
    }

    function definitions() {
        // NEW: The original rare-hat catalogue is exposed by v45. Fall back to a public
        // catalogue if a future build exposes it under window instead.
        if (Array.isArray(window.petpalGusRareHatDefinitions)) return window.petpalGusRareHatDefinitions;
        try {
            var stored = read(DEFINITIONS_KEY, []);
            return Array.isArray(stored) ? stored : [];
        } catch (e) { return []; }
    }

    function events() { return read(EVENTS_KEY, {}); }
    function progress() { return read(PROGRESS_KEY, {}); }
    function selections() { return read(SELECTIONS_KEY, {}); }
    function eventKey(childId, hatId) { return String(childId) + '::' + String(hatId); }

    function target(event) {
        var n = Math.floor(Number(event && event.target));
        return Number.isFinite(n) && n >= 1 ? n : 1;
    }

    function progressValue(childId, hatId) {
        var p = progress()[eventKey(childId, hatId)];
        return p ? Math.max(0, Number(p.value) || 0) : 0;
    }

    function selectedHatId(childId, defs, evs) {
        var picks = selections();
        var saved = picks[String(childId)];
        if (saved && defs.some(function(d) { return d.id === saved; })) return saved;

        var active = defs.find(function(d) {
            var e = evs[eventKey(childId, d.id)];
            return e && e.enabled;
        });
        return active ? active.id : (defs[0] ? defs[0].id : null);
    }

    function labelForType(type) {
        var labels = {
            challenge: 'Complete Gus Challenges',
            daily_goal: 'Reach Gus\'s Daily Goal',
            chores: 'Complete approved chores',
            gus_points: 'Earn Gus Points',
            hat_stars: 'Earn Hat Stars',
            manual: 'Parent awards the hat'
        };
        return labels[type] || 'Special event';
    }

    function saveSelection(childId, hatId) {
        var picks = selections();
        picks[String(childId)] = hatId;
        write(SELECTIONS_KEY, picks);
    }

    function saveEvent(childId, hatId, type, targetValue, start, end) {
        if (typeof window.petpalCreateGusRareHatEvent !== 'function') return false;

        // NEW: Disable any other event for this child so the selected reward is the only
        // rare hat attached to the event. Existing earned hats remain permanently unlocked.
        var evs = events();
        Object.keys(evs).forEach(function(key) {
            if (String(evs[key] && evs[key].childId) === String(childId) && key !== eventKey(childId, hatId)) {
                delete evs[key];
            }
        });
        write(EVENTS_KEY, evs);

        saveSelection(childId, hatId);
        return window.petpalCreateGusRareHatEvent(childId, hatId, type, targetValue, start, end);
    }

    function removeEvent(childId, hatId) {
        if (typeof window.petpalRemoveGusRareHatEvent === 'function') {
            window.petpalRemoveGusRareHatEvent(childId, hatId);
        } else {
            var evs = events();
            delete evs[eventKey(childId, hatId)];
            write(EVENTS_KEY, evs);
        }
    }

    function render() {
        var panel = document.getElementById(PANEL_ID);
        if (!panel) return;
        var children = getChildren();
        var defs = definitions();
        if (!children.length || !defs.length) return;

        var evs = events();
        var blocks = children.map(function(child) {
            var childId = String(child.id);
            var selectedId = selectedHatId(childId, defs, evs);
            var selected = defs.find(function(d) { return d.id === selectedId; }) || defs[0];
            var event = selected ? evs[eventKey(childId, selected.id)] || {} : {};
            var type = event.requirementType || selected.defaultRequirementType || 'challenge';
            var targetValue = event.target || selected.defaultTarget || 1;
            var start = event.startDate || selected.defaultStart || todayKey();
            var end = event.endDate || selected.defaultEnd || todayKey();
            var enabled = !!event.enabled;
            var prog = selected ? progressValue(childId, selected.id) : 0;
            var shownTarget = type === 'manual' ? 'manual' : targetValue;
            var choices = defs.map(function(d) {
                return '<option value="' + escapeHtml(d.id) + '" ' + (d.id === selected.id ? 'selected' : '') + '>' + escapeHtml(d.emoji + ' ' + d.name) + '</option>';
            }).join('');
            var eventStatus = enabled ? 'ACTIVE' : 'NOT ACTIVE';

            return '<div class="border-t border-slate-100 pt-4 mt-4" data-v46-child="' + escapeHtml(childId) + '">' +
                '<div class="text-xs font-extrabold text-slate-800">' + escapeHtml(child.name || 'Child') + '</div>' +
                '<div class="rounded-2xl border border-slate-200 bg-slate-50 p-3 mt-3">' +
                    '<div class="flex items-center justify-between gap-3">' +
                        '<div class="text-sm font-black text-slate-800">🎁 Event Reward Hat</div>' +
                        '<span class="text-[10px] font-extrabold ' + (enabled ? 'text-emerald-600' : 'text-slate-400') + '">' + eventStatus + '</span>' +
                    '</div>' +
                    '<div class="text-[10px] font-bold text-slate-500 mt-1">Choose the one rare hat this child can win for this event.</div>' +
                    '<label class="block text-[10px] font-bold text-slate-500 mt-3">Rare hat reward' +
                        '<select data-v46-hat="' + escapeHtml(childId) + '" class="block w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white">' + choices + '</select>' +
                    '</label>' +
                    '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">' +
                        '<select data-v46-type="' + escapeHtml(childId) + '" class="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white">' +
                            Object.keys({challenge:1,daily_goal:1,chores:1,gus_points:1,hat_stars:1,manual:1}).map(function(t) {
                                return '<option value="' + t + '" ' + (t === type ? 'selected' : '') + '>' + escapeHtml(labelForType(t)) + '</option>';
                            }).join('') +
                        '</select>' +
                        '<input type="number" min="1" step="1" value="' + escapeHtml(targetValue) + '" data-v46-target="' + escapeHtml(childId) + '" class="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white" />' +
                        '<label class="text-[10px] font-bold text-slate-500">Start <input type="date" value="' + escapeHtml(start) + '" data-v46-start="' + escapeHtml(childId) + '" class="block w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white" /></label>' +
                        '<label class="text-[10px] font-bold text-slate-500">End <input type="date" value="' + escapeHtml(end) + '" data-v46-end="' + escapeHtml(childId) + '" class="block w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white" /></label>' +
                    '</div>' +
                    '<div class="flex flex-wrap items-center gap-2 mt-3">' +
                        '<button type="button" data-v46-save="' + escapeHtml(childId) + '" class="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black">Save Event</button>' +
                        (enabled ? '<button type="button" data-v46-remove="' + escapeHtml(childId) + '" class="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700">Turn Off</button>' : '') +
                        (enabled && type === 'manual' ? '<button type="button" data-v46-award="' + escapeHtml(childId) + '" class="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-black">Award Hat</button>' : '') +
                        '<span class="text-[10px] font-bold text-slate-500">Progress: ' + Math.min(Number(prog) || 0, Number(targetValue) || 1) + ' / ' + escapeHtml(shownTarget) + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>';
        }).join('');

        panel.innerHTML = '<h3 class="font-black text-slate-800 text-sm flex items-center gap-2">✨ Rare Hats & Events</h3>' +
            '<p class="text-xs text-slate-500 mt-1">Choose the rare hat each child can win. The event ends on its end date; if the child completes it in time, the hat stays in their Gus Hat Closet permanently.</p>' +
            blocks;

        panel.querySelectorAll('[data-v46-hat]').forEach(function(select) {
            select.addEventListener('change', function() {
                var childId = select.getAttribute('data-v46-hat');
                saveSelection(childId, select.value);
                render();
            });
        });

        panel.querySelectorAll('[data-v46-save]').forEach(function(button) {
            button.addEventListener('click', function() {
                var childId = button.getAttribute('data-v46-save');
                var hatId = panel.querySelector('[data-v46-hat="' + CSS.escape(childId) + '"]').value;
                var type = panel.querySelector('[data-v46-type="' + CSS.escape(childId) + '"]').value;
                var targetValue = panel.querySelector('[data-v46-target="' + CSS.escape(childId) + '"]').value;
                var start = panel.querySelector('[data-v46-start="' + CSS.escape(childId) + '"]').value;
                var end = panel.querySelector('[data-v46-end="' + CSS.escape(childId) + '"]').value;
                if (!dateValue(start) || !dateValue(end) || dateValue(start) > dateValue(end)) {
                    alert('Please check the rare-hat event dates.');
                    return;
                }
                if (!saveEvent(childId, hatId, type, targetValue, start, end)) {
                    alert('Please check the rare-hat event settings.');
                    return;
                }
                render();
            });
        });

        panel.querySelectorAll('[data-v46-remove]').forEach(function(button) {
            button.addEventListener('click', function() {
                var childId = button.getAttribute('data-v46-remove');
                var hatId = panel.querySelector('[data-v46-hat="' + CSS.escape(childId) + '"]').value;
                removeEvent(childId, hatId);
                render();
            });
        });

        panel.querySelectorAll('[data-v46-award]').forEach(function(button) {
            button.addEventListener('click', function() {
                var childId = button.getAttribute('data-v46-award');
                var hatId = panel.querySelector('[data-v46-hat="' + CSS.escape(childId) + '"]').value;
                if (typeof window.petpalAwardGusRareHat !== 'function' || !window.petpalAwardGusRareHat(childId, hatId)) {
                    alert('Please save the event as a manual rare-hat event first.');
                    return;
                }
                render();
            });
        });
    }

    // NEW: Re-render after the v45 rare-hat panel appears or after existing portal renders.
    function schedule() {
        setTimeout(render, 0);
        setTimeout(render, 200);
        setTimeout(render, 600);
    }

    var previousParentRender = window.renderParentPortal;
    if (typeof previousParentRender === 'function' && !previousParentRender.__newV46RareHatRewardWrapped) {
        var wrappedParentRender = function() {
            var result = previousParentRender.apply(this, arguments);
            schedule();
            return result;
        };
        wrappedParentRender.__newV46RareHatRewardWrapped = true;
        window.renderParentPortal = wrappedParentRender;
    }

    document.addEventListener('DOMContentLoaded', schedule);
    window.petpalRefreshGusRareHatRewardSelector = schedule;
})();