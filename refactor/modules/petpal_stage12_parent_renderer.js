// STAGE 12: PARENT PORTAL RENDERER EXTRACTED WITHOUT API CHANGES
        function renderParentPortal() {
            const child = getActiveChild();

            document.getElementById('parentActiveChildName').innerText = child.name;
            document.getElementById('parentManageChildName').innerText = child.name;

            // Populate settings fields
            if (document.getElementById('parentChildNameInput')) {
                document.getElementById('parentChildNameInput').value = child.name;
            }
            if (document.getElementById('parentEditValuesName')) {
                document.getElementById('parentEditValuesName').innerText = child.name;
            }
            if (document.getElementById('parentEditBalance')) {
                document.getElementById('parentEditBalance').value = (child.balance || 0).toFixed(2);
            }
            if (document.getElementById('parentEditGusPoints')) {
                document.getElementById('parentEditGusPoints').value = child.gusPoints || 0;
            }
            if (document.getElementById('parentEditScreenTime')) {
                document.getElementById('parentEditScreenTime').value = child.screenTimeBank || 0;
            }

            // Populate Screen Time Rates
            const rates = appData.screenTimeRates || { treat: 15, brush: 20, play: 30 };
            if (document.getElementById('stTreatInput')) document.getElementById('stTreatInput').value = rates.treat;
            if (document.getElementById('stGroomInput')) document.getElementById('stGroomInput').value = rates.brush;
            if (document.getElementById('stFetchInput')) document.getElementById('stFetchInput').value = rates.play;

            // Approvals Queue
            let pendingTotal = 0;
            const pendingList = [];

            appData.children.forEach(c => {
                c.chores.forEach(ch => {
                    ensureChoreStatusByDay(ch);
                    Object.keys(ch.statusByDay).forEach(day => {
                        if (ch.statusByDay[day] === 'pending') {
                            pendingTotal++;
                            pendingList.push({ childName: c.name, childId: c.id, chore: ch, day: day });
                        }
                    });
                });
            });

            document.getElementById('parentPendingCount').innerText = `${pendingTotal} Tasks`;
            document.getElementById('pendingBadge').innerText = pendingTotal;

            const queue = document.getElementById('pendingApprovalQueue');

            if (pendingList.length === 0) {
                queue.innerHTML = `<div class="p-6 text-slate-400 text-sm text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">No chores pending review! All caught up.</div>`;
            } else {
                queue.innerHTML = pendingList.map(item => `
                    <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md">${item.childName}</span>
                                <span class="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">${item.day}</span>
                            </div>
                            <h4 class="font-bold text-slate-800 text-sm mt-1">${item.chore.title}</h4>
                            ${item.chore.description ? `<p class="text-xs text-slate-500">${item.chore.description}</p>` : ''}
                            <p class="text-xs text-emerald-600 font-bold mt-0.5">+£${item.chore.reward.toFixed(2)} Pocket Money & +${item.chore.gusPointsReward || 10} 🐾 Gus Pts & +${item.chore.screenTimeReward || 15}m 🎮</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="approveChore('${item.childId}', '${item.chore.id}', '${item.day}')" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm">
                                Approve & Pay
                            </button>
                            <button onclick="rejectChore('${item.childId}', '${item.chore.id}', '${item.day}')" class="px-3.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold">
                                Reject
                            </button>
                        </div>
                    </div>
                `).join('');
            }

            // Active Chores List
            const parentChoreList = document.getElementById('parentChoreList');
            if (parentChoreList) {
                parentChoreList.innerHTML = child.chores.map(c => `
                    <div class="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-start justify-between">
                        <div>
                            <h4 class="font-bold text-slate-800 text-sm">${c.title}</h4>
                            ${c.description ? `<p class="text-xs text-slate-500 mb-1">${c.description}</p>` : ''}
                            <div class="flex flex-wrap items-center gap-1.5 mt-1">
                                <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">£${c.reward.toFixed(2)}</span>
                                <span class="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">+${c.gusPointsReward || 10} 🐾</span>
                                <span class="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md">+${c.screenTimeReward || 15}m 🎮</span>
                                <span class="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">${c.days.join(', ')}</span>
                            </div>
                        </div>
                        <button onclick="deleteChore('${c.id}')" class="text-rose-400 hover:text-rose-600 text-sm p-1"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `).join('');
            }
        }

