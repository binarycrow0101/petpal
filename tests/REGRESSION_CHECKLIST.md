# PetPal Manual Regression Checklist

Use a test browser profile first. Record browser, date, stage, pass/fail, and console errors.

## Smoke test
- [ ] Open `http://localhost:8000/`.
- [ ] No failed requests for `modules/*.js` or `assets/gus/hats/*.svg`.
- [ ] No uncaught JavaScript errors on initial load.
- [ ] Kids portal, Gus, child profile, and chores render.

## Parent and child workflows
- [ ] Parent mode/PIN open and close correctly.
- [ ] Switch child profile; verify distinct state.
- [ ] Add/edit/delete chore.
- [ ] Complete, approve, and reject chores; verify rewards and persisted status.
- [ ] Change payment day and child settings; refresh and confirm persistence.

## Gus and rewards
- [ ] Gus interaction buttons work.
- [ ] Star bank/reward pool updates as expected.
- [ ] Daily star target setting saves and progress is correct.
- [ ] Happiness settings appear once and save.
- [ ] Unlock/select normal hat.
- [ ] Unlock/select rare Halloween hat; confirm it remains available after refresh and displays on Gus.

## Data and presentation
- [ ] Refresh and restart the server; expected data remains.
- [ ] Backup/export and import in a disposable test profile.
- [ ] Compare layout and behavior at desktop and narrow widths.
- [ ] Confirm no unexpected localStorage keys or destructive data changes.
