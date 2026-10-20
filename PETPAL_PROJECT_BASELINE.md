# PetPal Project Baseline & Recovery Contract

**Baseline date:** 2026-10-20  
**Working checkpoint:** Stage 24 — daily Gus star target system extracted  
**Source of truth:** the original production PetPal HTML app, `PetPal_Reward_Claims_v2(2).html`. Never overwrite that file during refactoring.

## 1. Purpose

This document is the durable reference point for future maintenance. The goal is an internal refactor that preserves existing behavior, not a redesign or rewrite. When unsure, preserve the current behavior and stop to investigate.

## 2. Non-negotiable compatibility rules

- Do not intentionally change visual appearance, layout, styling, colors, typography, spacing, animations, artwork, responsive behavior, navigation, buttons, or workflows.
- Do not change chore/reward rules, Gus behavior, profile behavior, parent/kids flows, backups, reports, or persistence semantics without explicit approval.
- Treat localStorage as a public data API. Preserve keys, serialized formats, object/array shapes, IDs, and existing user data. No silent migration, clearing, or renaming.
- Keep important DOM IDs, data attributes, CSS classes, and existing public function names stable.
- Preserve classic script ordering and global scope. Top-level `let`/`const` declarations and wrapper order can be behaviorally significant.
- Do not consolidate wrapper chains or remove older layers merely because they look redundant. First map what they read, write, call, and render.
- Make one small change at a time. Keep the last known-good checkpoint untouched and verify before moving on.

## 3. Current architecture

The app is still a single HTML entry point with a mixture of inline scripts and extracted classic JavaScript files. It is **not yet** a fully clean modular architecture. The staged module names below reflect current extraction checkpoints, not a guarantee that every subsystem has been consolidated.

Expected module responsibilities based on the current script manifest:

- `petpal_stage02_audio.js` — existing audio engine.
- `core-state.js` / `persistence.js` — shared default state, state access, loading/saving.
- `petpal_stage05_parent_mode.js` — parent-mode and PIN controls.
- `profiles.js` — child profile operations.
- `petpal_stage07_child_values.js` — parent-editable child values and screen-time rates.
- `petpal_stage21_chores.js` — chore history/filter and parent chore CRUD/approval actions.
- `petpal_stage21_gus_actions.js` — kid-facing Gus interaction compatibility function.
- `petpal_stage10_kids_renderer.js` — kids portal renderer.
- `petpal_stage12_parent_renderer.js` — parent portal renderer.
- `petpal_stage13_app_lifecycle.js` — app render/init lifecycle.
- `petpal_stage14_parent_tabs.js` — parent-tab navigation.
- `petpal_stage22_rewards.js` — Gus reward-pool layer.
- `petpal_stage23_child_rewards.js` — per-child star/reward state and history.
- `petpal_stage24_daily_star_targets.js` — daily Gus-star target/progress subsystem.
- `petpal_stage18_hats.js` — Gus hat catalogue/unlock integration and rare-hat behavior.

Script loading order in `index.html` is intentional. Do not alphabetize it.

## 4. Persistence contract

The following localStorage keys were identified during Phase 1. Treat every one as protected until proven otherwise:

- `petpal_app_data`
- `petpal_profiles`
- `petpal_active_child`
- `petpalCurrentWeekKey`
- `gusRewardsPool`
- `gusStarBank`
- `gusRewardStage`
- `gusChildStarStates`
- `gusChildRewardSettings`
- `gusChildRewardHistory`
- `gusChildDailyStarTargets`
- `gusTargetDailyStarHistory`
- `gusPerChildDailyStarHistory`
- `gusDailyChallenges`
- `petpalPayMeRequests`
- `petpalGusHatCollectionState`
- `petpalGusHatRequirementOverrides`
- `petpalGusHatArtOverrides`

Some storage keys are used by historical or extension layers. Do not delete one because it is not obvious in the current UI. New keys require an explicit design decision and documentation.

## 5. High-risk areas

1. Render wrappers around `renderApp`, `renderParentPortal`, and `renderKidsPortal`.
2. Gus hats, including rare-hat registration, artwork lookup, collection state, and per-child unlock behavior.
3. Gus happiness/stars and reward milestone interactions.
4. Chore status, daily filtering, approval/rejection, and reward payout.
5. Timers, delayed rendering, event listener registration, and DOM post-processing.
6. Browser localStorage and child/profile switching.

## 6. How to run

Use a local web server from the folder containing `index.html`:

```powershell
python -m http.server 8000
```

Then browse to `http://localhost:8000/`. Stop with `Ctrl+C`. Serve from the project root so `modules/...` and `assets/...` resolve relative to the entry point.

## 7. Regression checklist

Test in a safe browser profile/storage context before using the family’s real data. Record pass/fail and console errors for each:

- [ ] App loads with no missing local JavaScript modules.
- [ ] Kids portal renders and shows the active child.
- [ ] Gus appears; interaction buttons work and do not throw errors.
- [ ] Chores appear and can be completed; status persists after refresh.
- [ ] Parent mode opens; PIN success and failure paths behave correctly.
- [ ] Profiles appear; switching child preserves each child's data.
- [ ] Parent chore creation, editing, deletion, approval, and rejection work.
- [ ] Payment day / child values can be changed and persist.
- [ ] Reward pool and star bank update correctly.
- [ ] Daily Gus-star target can be changed and progress/awards behave correctly.
- [ ] Gus happiness settings appear once and the working control saves.
- [ ] Normal and rare hats appear, can be selected/unlocked, and render on Gus.
- [ ] Backup/export/import flows work without data loss.
- [ ] Refresh and restart preserve expected state.
- [ ] No unexpected visual or responsive changes at desktop and narrow viewport sizes.

## 8. Recovery procedure

If a change breaks the app:

1. Stop editing and do not overwrite the last known-good checkpoint.
2. Note the exact action that caused the failure and copy the first relevant Console error.
3. Revert only the latest changed file(s), or restore the previous complete checkpoint package.
4. Confirm the module script paths and order match the checkpoint.
5. Test in a separate browser profile before touching real data.
6. Do not clear localStorage as a debugging shortcut. Export/backup first; clearing it may destroy user data.
7. Compare behavior against the production source and the checklist above before retrying.

## 9. Stage history

- **Phase 1:** mapped architecture, persistence keys, render wrappers, and high-risk subsystems; no app changes.
- **Stages 2–13:** extracted audio, core state/persistence helpers, parent mode, profiles, child values, chore filters/actions, kids renderer, parent chore functions/renderer, and app lifecycle.
- **Stages 14–18:** repaired parent-tab and chore-approval issues, removed duplicate obsolete Gus-happiness layers, and fixed rare-hat re-registration. User explicitly confirmed Stage 18 hat behavior worked.
- **Stages 19–20:** attempted cleaner core/persistence/profile boundaries.
- **Stage 21:** separated chore operations and retained Gus interaction compatibility code.
- **Stage 22:** extracted Gus reward-pool layer.
- **Stage 23:** extracted per-child reward/star state.
- **Stage 24:** extracted daily Gus-star target/progress system. Static JavaScript syntax and storage-key checks passed; full browser regression testing is still required.

## 10. Known limitations / do not assume

- A static syntax check does not prove browser behavior.
- A module file existing does not prove its URL loads successfully; check DevTools Network and Console.
- External CDN resources (Tailwind and canvas-confetti) require network access unless separately vendored.
- The current architecture is an intermediate refactor. Avoid broad cleanup, ES module conversion, styling changes, or rewriting until the behavior checklist passes.
- When an older stage and current production disagree, production behavior wins.
