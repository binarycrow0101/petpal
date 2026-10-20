// STAGE 21: GUS ACTIONS COMPATIBILITY MODULE
// Existing Stage 09 interactWithGus moved here unchanged.

// STAGE 09: CORE KID ACTIONS EXTRACTED WITHOUT API CHANGES
        function interactWithGus(action) {
            const child = getActiveChild();
            const rates = appData.screenTimeRates || { treat: 15, brush: 20, play: 30 };
            
            let cost = 10;
            let happinessGain = 20;
            let screenTimeGain = rates.treat;
            let soundAction = () => AudioEngine.playBark();

            if (action === 'brush') {
                cost = 15;
                happinessGain = 30;
                screenTimeGain = rates.brush;
            } else if (action === 'play') {
                cost = 20;
                happinessGain = 40;
                screenTimeGain = rates.play;
            }

            if (child.gusPoints < cost) {
                document.getElementById('gusSpeechBubble').innerText = `"Woof! You need ${cost} Gus Points to ${action} with me! Do your chores to earn points."`;
                return;
            }

            // Deduct Points and reward screen time
            child.gusPoints -= cost;
            child.screenTimeBank += screenTimeGain;
            child.happiness = Math.min(100, (child.happiness || 80) + happinessGain);

            soundAction();

            // Trigger Gus animation
            const gusSvg = document.getElementById('gusSvg');
            if (gusSvg) {
                gusSvg.classList.add('gus-bounce');
                setTimeout(() => gusSvg.classList.remove('gus-bounce'), 1500);
            }

            // Confetti effect
            if (typeof confetti === 'function') {
                confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
            }

            document.getElementById('gusSpeechBubble').innerText = `"Woof! Thank you for the ${action}! +${screenTimeGain}m Screen Time earned!"`;

            saveData();
            renderKidsPortal();
        }
