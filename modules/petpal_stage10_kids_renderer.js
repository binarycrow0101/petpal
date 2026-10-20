// STAGE 10: KIDS PORTAL RENDERER EXTRACTED WITHOUT API CHANGES
        function renderKidsPortal() {
            const child = getActiveChild();

            document.getElementById('kidsHeaderName').innerText = child.name;
            document.getElementById('kidsBankBalance').innerText = `£${(child.balance || 0).toFixed(2)}`;
            document.getElementById('kidsGusPointsDisplay').innerText = `${child.gusPoints || 0} 🐾`;
            document.getElementById('kidsScreenTimeDisplay').innerText = `${child.screenTimeBank || 0}m 🎮`;
            document.getElementById('gusPointsBadge').innerText = `${child.gusPoints || 0} Pts`;

            // Companion level based on lifetime points or balance
            const level = Math.floor((child.gusPoints || 0) / 30) + 1;
            document.getElementById('gusLevel').innerText = level;

            // Dates
            const options = { weekday: 'long', month: 'short', day: 'numeric' };
            document.getElementById('currentFullDate').innerText = new Date().toLocaleDateString('en-GB', options);

            // Gus Mood & Happiness
            const hap = child.happiness || 80;
            document.getElementById('gusHappinessBar').style.width = `${hap}%`;
            document.getElementById('gusMoodLabel').innerText = `${hap}% Happy`;

            // Render Day Filter Tabs
            const dayTabs = document.getElementById('dayFilterTabs');
            if (dayTabs) {
                dayTabs.innerHTML = DAYS_OF_WEEK.map(day => `
                    <button onclick="setKidsDayFilter('${day}')" class="px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${currentKidsDayFilter === day ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                        ${day}
                    </button>
                `).join('');
            }

            // Render Chores List for Active Day
            const choreList = document.getElementById('kidsChoreList');
            if (choreList) {
                const dayChores = child.chores.filter(c => c.days && c.days.includes(currentKidsDayFilter));

                if (dayChores.length === 0) {
                    choreList.innerHTML = `<div class="p-8 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">No chores scheduled for ${currentKidsDayFilter}! Take a break! 🐾</div>`;
                } else {
                    choreList.innerHTML = dayChores.map(c => {
                        ensureChoreStatusByDay(c);
                        const status = c.statusByDay[currentKidsDayFilter] || 'open';

                        let statusBtn = '';
                        if (status === 'completed') {
                            statusBtn = `<span class="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1"><i class="fa-solid fa-circle-check"></i> Approved!</span>`;
                        } else if (status === 'pending') {
                            statusBtn = `<span class="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1"><i class="fa-solid fa-clock"></i> Pending Review</span>`;
                        } else {
                            statusBtn = `<button onclick="completeChoreByKid('${c.id}', '${currentKidsDayFilter}')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all">Done! <i class="fa-solid fa-check ml-1"></i></button>`;
                        }

                        return `
                            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/50 transition-colors">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-bold">
                                        <i class="fa-solid fa-clipboard-check"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-extrabold text-slate-800 text-sm">${c.title}</h4>
                                        ${c.description ? `<p class="text-xs text-slate-500 mt-0.5">${c.description}</p>` : ''}
                                        <div class="flex items-center gap-2 mt-1">
                                            <span class="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+£${c.reward.toFixed(2)}</span>
                                            <span class="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">+${c.gusPointsReward || 10} 🐾</span>
                                            <span class="text-[10px] font-extrabold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md">+${c.screenTimeReward || 15}m 🎮</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    ${statusBtn}
                                </div>
                            </div>
                        `;
                    }).join('');
                }
            }
        }
