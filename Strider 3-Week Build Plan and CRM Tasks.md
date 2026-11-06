# Strider: 3-Week Build Plan and CRM Tasks

Nov 2, 2026 · @kabir

.

Each engineer has their own task list below, and every task follows the CRM's Forge a new task fields. Create **Strider** as a project in the CRM first, since it is not in the project list. Deadlines are 17:00 Lagos time, with Mon 2 Nov as day 1 and delivery on Fri 20 Nov.

## Gold: engine tasks (19 tasks, about 91h)

### G1. Review the stage contracts

**Brief:** Read every stage contract and flag anything unclear before building starts.

**Acceptance criteria:**

- Comments left on every contract
- Approved, or changes agreed with Kabiru

**Deliverables:** comments in `docs/contracts/`; approval note.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** Critical · **Difficulty:** II Easy · **Deadline:** Tue 3 Nov, 17:00 · **Estimate:** 2h · **Collaborators:** Kabiru, Edidiong · **Kit:** Write the docs

### G2. Set up the engine project skeleton and test runner

**Brief:** A folder per component, a test runner and a config file, so everyone builds in the same layout.

**Acceptance criteria:**

- One command runs all tests
- Settings live in a config file, with no secrets and no client data in the repo

**Deliverables:** engine project skeleton; README with run steps.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** High · **Difficulty:** II Easy · **Deadline:** Tue 3 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### G3. Build the pipeline stubs

**Brief:** Each stage returns fake data in the right shape, so the whole pipeline runs end to end from day 2.

**Acceptance criteria:**

- Stubs match the contracts
- The pipeline runs the stages in order
- Edidiong can call it from the app

**Deliverables:** stub modules; pipeline run log.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Wed 4 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### G4. Inspect the pilot data

**Brief:** Look at the real pilot file, or log the request if it has not arrived.

**Acceptance criteria:**

- Notes on format, size, coordinate system and quality are written
- If the data is missing, a dated request is logged

**Deliverables:** pilot data notes; delay log entry if the data is missing.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** High · **Difficulty:** II Easy · **Deadline:** Thu 5 Nov, 17:00 · **Estimate:** 3h · **Collaborators:** Kabiru · **Kit:** Write the docs

### G5. Build the file receiver (M1.1)

**Brief:** Accept an upload and store the raw file untouched, with its SHA-256 hash and a record.

**Acceptance criteria:**

- The stored copy has the same hash as the original
- Empty, wrong-type, oversized and duplicate files are rejected, with one test per rule

**Deliverables:** module; tests.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Thu 5 Nov, 17:00 · **Estimate:** 5h · **Collaborators:** Edidiong · **Kit:** Ship a feature

### G6. Build the format reader (M1.2)

**Brief:** Read the stored file into a standard point table (x, y, z), built so a new format only changes this module.

**Acceptance criteria:**

- Sample files in each supported format give the same point count and values
- Corrupt files fail safely with a clear message

**Deliverables:** reader module; tests; small sample files.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Fri 6 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Edidiong · **Kit:** Ship a feature

### G7. Build the metadata and coordinate check (M1.3)

**Brief:** Summarise point count, bounds, density, units and coordinate system.

**Acceptance criteria:**

- Known test files give the right bounds and coordinate system
- Missing coordinate information is flagged and never guessed

**Deliverables:** module; tests.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** High · **Difficulty:** III Medium · **Deadline:** Mon 9 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### G8. Build the first terrain surface

**Brief:** Turn clean points into a gridded ground surface.

**Acceptance criteria:**

- Heights match known values on the flat and sloped golden terrains
- Kabiru has run it and agrees

**Deliverables:** terrain module; tests; sample output.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** Critical · **Difficulty:** IV Hard · **Deadline:** Tue 10 Nov, 17:00 · **Estimate:** 8h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### G9. Build the quality validator (M1.4)

**Brief:** Flag gaps, duplicates, outliers, blank values and sparse data as pass, warn or fail.

**Acceptance criteria:**

- A planted spike, hole and blank values are each caught
- Thresholds come from the config file, with placeholders marked until the civil engineer sets them

**Deliverables:** module; tests; planted-fault test files.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** Critical · **Difficulty:** IV Hard · **Deadline:** Wed 11 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Edidiong · **Kit:** Ship a feature

### G10. Build the cleaner and normaliser (M1.5)

**Brief:** Remove bad points and convert everything to the project's coordinate system and units.

**Acceptance criteria:**

- Duplicates and outliers are removed and good points are unchanged
- Coordinates and units convert correctly on a known test file

**Deliverables:** module; tests.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** Critical · **Difficulty:** IV Hard · **Deadline:** Thu 12 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### G11. Build the background pipeline runner

**Brief:** Run the stages in order as a background job, so the app never freezes.

**Acceptance criteria:**

- Edidiong's app can start a run and read its status
- A failed stage stops the run with a clear message

**Deliverables:** runner; tests.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** Critical · **Difficulty:** IV Hard · **Deadline:** Fri 13 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Edidiong · **Kit:** Ship a feature

### G12. Cross-test Kabiru's alignment on golden terrains

**Brief:** Try to break the alignment with steep, flat and awkward terrains.

**Acceptance criteria:**

- A written list of cases tried, each marked pass or fail
- Every failure has steps to reproduce

**Deliverables:** test notes; bug list.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** High · **Difficulty:** III Medium · **Deadline:** Fri 13 Nov, 17:00 · **Estimate:** 3h · **Collaborators:** Kabiru · **Kit:** Fix a bug

### G13. Build the intake report and hand-off (M1.6)

**Brief:** Save the cleaned dataset and write a plain-language report of what was found and fixed.

**Acceptance criteria:**

- The report matches the data and is readable by a non-technical person
- The terrain stage loads the saved dataset without errors

**Deliverables:** report module; sample report.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** High · **Difficulty:** III Medium · **Deadline:** Mon 16 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Edidiong · **Kit:** Ship a feature

### G14. Store a record of every run

**Brief:** Keep the input hash, rule settings and code version for each run, so any result can be reproduced.

**Acceptance criteria:**

- Re-running from a record gives identical results
- The record can be read from the app

**Deliverables:** run record module; tests.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Mon 16 Nov, 17:00 · **Estimate:** 5h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### G15. Build regeneration (M6)

**Brief:** When the data or route changes, re-run the whole pipeline automatically.

**Acceptance criteria:**

- A change triggers a new run with a new record
- A failed or interrupted run recovers cleanly and can be retried

**Deliverables:** regeneration code; tests.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** Critical · **Difficulty:** IV Hard · **Deadline:** Tue 17 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Edidiong · **Kit:** Ship a feature

### G16. Run the pilot data end to end and share the results

**Brief:** Push the real pilot data through intake and terrain and report what breaks.

**Acceptance criteria:**

- Pilot data runs through intake and terrain
- The results note lists every problem found

**Deliverables:** results note.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Wed 18 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### G17. Cross-test Kabiru's profile, cross-sections and quantities

**Brief:** Check the numbers against the golden hand calculations, and try to break them.

**Acceptance criteria:**

- Every golden case checked and marked pass or fail
- Every failure has steps to reproduce

**Deliverables:** test notes; bug list.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** High · **Difficulty:** III Medium · **Deadline:** Wed 18 Nov, 17:00 · **Estimate:** 3h · **Collaborators:** Kabiru · **Kit:** Fix a bug

### G18. Fix engine bugs

**Brief:** Fix every bug assigned to the engine and make runs reliable.

**Acceptance criteria:**

- Every assigned bug is fixed with a new test
- No failed runs on the pilot data

**Deliverables:** fixes; tests.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** High · **Difficulty:** III Medium · **Deadline:** Thu 19 Nov, 17:00 · **Estimate:** 8h · **Collaborators:** Kabiru · **Kit:** Fix a bug

### G19. Support the final demo rehearsal

**Brief:** Be ready to answer engine questions and rerun the pilot data live.

**Acceptance criteria:**

- The final demo runs on staging with the pilot data
- Engine questions from the rehearsal are answered

**Deliverables:** rehearsal notes.

**Settings:** **Project:** Strider · **Assignee:** Gold · **Priority:** Medium · **Difficulty:** II Easy · **Deadline:** Fri 20 Nov, 12:00 · **Estimate:** 2h · **Collaborators:** Kabiru, Edidiong · **Kit:** Write the docs

## Kabiru: lead and design logic tasks (26 tasks, about 110h)

### K1. Write the stage contracts

**Brief:** Define each stage's inputs and outputs so all three engineers can build at once.

**Acceptance criteria:**

- One contract file per stage, with fields, units and coordinate system
- Approved by Gold and Edidiong
- A fake sample output for every stage

**Deliverables:** `docs/contracts/` folder; fake sample data.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Tue 3 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Gold, Edidiong · **Kit:** Write the docs

### K2. Build the synthetic terrain generator

**Brief:** Make fake terrains with known answers, so nobody waits for real data.

**Acceptance criteria:**

- Generates flat, sloped and simple hill terrains
- One command runs it, and no client data is used

**Deliverables:** generator script.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Wed 4 Nov, 17:00 · **Estimate:** 5h · **Collaborators:** Gold · **Kit:** Ship a feature

### K3. Write the golden cases with hand calculations

**Brief:** Work out the correct cut and fill for each fake terrain by hand, so the engine can be checked against known answers.

**Acceptance criteria:**

- Expected cut and fill for each terrain is written in its test, with the working
- Gold has checked the arithmetic

**Deliverables:** golden test cases.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Wed 4 Nov, 17:00 · **Estimate:** 3h · **Collaborators:** Gold · **Kit:** Ship a feature

### K4. Confirm the scope and the clock start

**Brief:** Get the MVP scope agreed in writing and confirm when the 4 to 6 week clock actually began.

**Acceptance criteria:**

- MVP scope agreed with Mastodon in writing
- Status of the MVP fee and the pilot data confirmed, and the clock start date recorded

**Deliverables:** scope note; clock start record.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** II Easy · **Deadline:** Thu 5 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Edidiong · **Kit:** Write the docs

### K5. Engage the civil engineer and draft the design rules

**Brief:** Get a registered engineer to own the design rules the engine will use.

**Acceptance criteria:**

- The engineer is named and has agreed to review and sign off
- A rules config (grades, curve radius, widths, side slopes) is drafted, with every placeholder marked "to be confirmed"

**Deliverables:** rules config draft; note of who the engineer is.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** II Easy · **Deadline:** Thu 5 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Gold · **Kit:** Write the docs

### K6. Request the pilot data and BEME template, and start the delay log

**Brief:** Ask Mastodon for the two inputs we depend on, and record every delay from them.

**Acceptance criteria:**

- Both requests sent in writing and dated
- Delay log started, with the dates of the requests

**Deliverables:** sent requests; delay log.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** High · **Difficulty:** I Trivial · **Deadline:** Thu 5 Nov, 17:00 · **Estimate:** 1h · **Collaborators:** Edidiong · **Kit:** Write the docs

### K7. Send the weekly update to Mastodon

**Brief:** A short written progress update, because the agreement ties refunds and extensions to these records. Repeat every Friday (6, 13 and 20 Nov).

**Acceptance criteria:**

- Update covers done, doing and blocked
- A copy is saved in the docs

**Deliverables:** sent update; saved copy.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** High · **Difficulty:** I Trivial · **Deadline:** Fri 6 Nov, 17:00 · **Estimate:** 1h · **Collaborators:** none · **Kit:** Write the docs

### K8. Send the accuracy method to Mastodon

**Brief:** Agree in writing how accuracy and turnaround will be measured, before the pilot is judged.

**Acceptance criteria:**

- The method states what is measured (volume error, elevation error, processing time) and how
- Sent to Mastodon for written agreement

**Deliverables:** method document; sent message.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Fri 6 Nov, 17:00 · **Estimate:** 3h · **Collaborators:** Gold · **Kit:** Write the docs

### K9. Build the alignment inputs and rules config (M2)

**Brief:** Let the user give a start and end point, and read the limits from the rules config.

**Acceptance criteria:**

- Start and end points are accepted as inputs
- Maximum grade and curve radius come from the config, not the code

**Deliverables:** input handling; config wiring.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Fri 6 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Gold · **Kit:** Ship a feature

### K10. Build the centreline generation (M2)

**Brief:** Generate the road path across the terrain within the grade limit.

**Acceptance criteria:**

- The centreline stays within the maximum grade on the golden terrains
- Gold has tested it

**Deliverables:** alignment module; tests.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** IV Hard · **Deadline:** Tue 10 Nov, 17:00 · **Estimate:** 8h · **Collaborators:** Gold · **Kit:** Ship a feature

### K11. Test Gold's terrain surface

**Brief:** Check the surface against the golden terrains and try to break it.

**Acceptance criteria:**

- Heights checked on the flat and sloped golden terrains
- Every failure logged with steps to reproduce

**Deliverables:** test notes; bug list.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** High · **Difficulty:** II Easy · **Deadline:** Wed 11 Nov, 17:00 · **Estimate:** 2h · **Collaborators:** Gold · **Kit:** Fix a bug

### K12. Build the longitudinal profile (M3)

**Brief:** Sample the ground height along the centreline and design the profile within grade limits.

**Acceptance criteria:**

- Ground elevation sampled along the centreline
- Profile matches a known slope within tolerance in the test

**Deliverables:** profile module; tests.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Wed 11 Nov, 17:00 · **Estimate:** 5h · **Collaborators:** Gold · **Kit:** Ship a feature

### K13. Build the cross-sections (M4)

**Brief:** Cut slices across the road at regular intervals, showing the road against the ground.

**Acceptance criteria:**

- Sections are produced at the interval set in the config
- Road width and side slopes come from the config
- The output can be read by Edidiong's viewer

**Deliverables:** cross-section module; tests; sample data.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** IV Hard · **Deadline:** Thu 12 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Gold, Edidiong · **Kit:** Ship a feature

### K14. Build the first earthwork quantities (M5)

**Brief:** Calculate cut and fill from the same terrain and design data used for the drawings.

**Acceptance criteria:**

- Cut and fill come from the same data as the sections
- The golden terrains give the hand-calculated volumes

**Deliverables:** quantities module; tests.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** IV Hard · **Deadline:** Fri 13 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Gold · **Kit:** Ship a feature

### K15. Hold the first client demo

**Brief:** Show Mastodon the working system on staging and collect feedback.

**Acceptance criteria:**

- Demo runs on staging
- Feedback is logged and sorted into MVP, later or no

**Deliverables:** demo notes; feedback log.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** II Easy · **Deadline:** Fri 13 Nov, 17:00 · **Estimate:** 2h · **Collaborators:** Gold, Edidiong · **Kit:** Write the docs

### K16. Verify the quantities against the hand calculations

**Brief:** Prove the numbers are right on every golden case.

**Acceptance criteria:**

- Every golden case matches within tolerance
- Any discrepancy is fixed or logged with a reason

**Deliverables:** verified tests; notes.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** IV Hard · **Deadline:** Mon 16 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Gold · **Kit:** Fix a bug

### K17. Define the report metrics

**Brief:** Decide exactly what the pilot report measures and how each number is calculated.

**Acceptance criteria:**

- Volume error, elevation error, processing time and failed runs are each defined
- Each has a stated calculation method matching what was sent to Mastodon

**Deliverables:** metrics definition.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** High · **Difficulty:** II Easy · **Deadline:** Mon 16 Nov, 17:00 · **Estimate:** 3h · **Collaborators:** Edidiong · **Kit:** Write the docs

### K18. Freeze the scope in writing

**Brief:** Lock the MVP so the last week goes into testing, not new features.

**Acceptance criteria:**

- Feature list confirmed to the team and sent to Mastodon
- New requests are logged as "later"

**Deliverables:** scope freeze note.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** II Easy · **Deadline:** Tue 17 Nov, 17:00 · **Estimate:** 2h · **Collaborators:** Gold, Edidiong · **Kit:** Write the docs

### K19. Arrange the engineer's check of the results

**Brief:** Get a registered engineer or surveyor to check a sample of the results independently.

**Acceptance criteria:**

- A sample of results given to the engineer with the inputs and rule values
- Their findings received in writing

**Deliverables:** sample pack; written findings.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Tue 17 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Gold · **Kit:** Write the docs

### K20. Measure accuracy on the pilot data

**Brief:** Run the agreed accuracy method on the real pilot data.

**Acceptance criteria:**

- All four metrics calculated by the agreed method
- Results written up, with any gaps explained

**Deliverables:** accuracy results.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** IV Hard · **Deadline:** Wed 18 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Gold, Edidiong · **Kit:** Ship a feature

### K21. Hold the second client demo

**Brief:** Show the near-final MVP and confirm nothing is a surprise.

**Acceptance criteria:**

- Demo runs on staging with the pilot data
- Feedback logged and sorted into MVP, later or no

**Deliverables:** demo notes.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** II Easy · **Deadline:** Wed 18 Nov, 17:00 · **Estimate:** 2h · **Collaborators:** Gold, Edidiong · **Kit:** Write the docs

### K22. Test Edidiong's app, BEME and report

**Brief:** Try to break every screen and export before the client does.

**Acceptance criteria:**

- The BEME opens in Excel and matches the layout of Mastodon's sample
- Each screen tested on a mid-range phone and a slow connection
- Every failure logged with steps to reproduce

**Deliverables:** test notes; bug list.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** High · **Difficulty:** III Medium · **Deadline:** Thu 19 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Edidiong · **Kit:** Fix a bug

### K23. Rehearse the final demo on staging

**Brief:** Run the full demo once start to finish with the team.

**Acceptance criteria:**

- Demo runs end to end on staging with the pilot data
- Anything that breaks is fixed or removed from the demo

**Deliverables:** rehearsal notes.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** II Easy · **Deadline:** Thu 19 Nov, 17:00 · **Estimate:** 3h · **Collaborators:** Gold, Edidiong · **Kit:** Write the docs

### K24. Deliver the MVP and hand over

**Brief:** Submit the MVP in writing, which starts Mastodon's review clock, and hand over the docs.

**Acceptance criteria:**

- MVP submitted to Mastodon in writing, with the date recorded
- Docs and decision log shared

**Deliverables:** delivery note; handover docs.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Fri 20 Nov, 17:00 · **Estimate:** 5h · **Collaborators:** Gold, Edidiong · **Kit:** Write the docs

### K25. Hold the closing retro

**Brief:** Record what to repeat and what to change.

**Acceptance criteria:**

- One to three changes agreed for the next phase

**Deliverables:** retro notes.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** Medium · **Difficulty:** I Trivial · **Deadline:** Fri 20 Nov, 17:00 · **Estimate:** 1h · **Collaborators:** Gold, Edidiong · **Kit:** Write the docs

### K26. Run the full pipeline every day

**Brief:** A daily integration run, so mismatches between the three engineers show up the same day. Repeat daily from Wed 4 Nov to Fri 20 Nov.

**Acceptance criteria:**

- Pipeline runs end to end each day on the fake or pilot data
- Anything broken is fixed before new work starts

**Deliverables:** daily run result in the team update.

**Settings:** **Project:** Strider · **Assignee:** Kabiru · **Priority:** High · **Difficulty:** II Easy · **Deadline:** Fri 20 Nov, 17:00 · **Estimate:** 1h per day · **Collaborators:** Gold, Edidiong · **Kit:** Ship a feature

## Edidiong: app and export tasks (20 tasks, about 89h)

### E1. Review the stage contracts

**Brief:** Read every stage contract and flag anything unclear before building starts.

**Acceptance criteria:**

- Comments left on every contract
- Approved, or changes agreed with Kabiru

**Deliverables:** comments in `docs/contracts/`; approval note.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** Critical · **Difficulty:** II Easy · **Deadline:** Tue 3 Nov, 17:00 · **Estimate:** 2h · **Collaborators:** Kabiru, Gold · **Kit:** Write the docs

### E2. Scaffold the app project

**Brief:** Create the app with empty pages for login, upload and project, so screens can be built in parallel.

**Acceptance criteria:**

- The app runs locally with one command
- Routes exist for login, upload and project
- No secrets in the repo

**Deliverables:** app skeleton; README with run steps.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** High · **Difficulty:** II Easy · **Deadline:** Tue 3 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### E3. Set up staging

**Brief:** A safe test and demo environment, separate from production.

**Acceptance criteria:**

- Reachable by the whole team and deploys from main
- Secrets live in environment variables
- No client data

**Deliverables:** staging URL; deploy notes.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** High · **Difficulty:** II Easy · **Deadline:** Wed 4 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### E4. Build the login screen with fake users

**Brief:** A working login and two roles on fake accounts, so the rest of the app can assume a signed-in user.

**Acceptance criteria:**

- A fake user can sign in and out
- Two roles exist and the screen shows which one is active
- Screenshots attached

**Deliverables:** login screen on staging; screenshots.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Thu 5 Nov, 17:00 · **Estimate:** 5h · **Collaborators:** Gold · **Kit:** Ship a feature

### E5. Build the upload screen on fake results

**Brief:** Choose a file, upload it and see the result, using the fake outputs from the contracts.

**Acceptance criteria:**

- A file can be chosen and sent, with progress shown
- The fake result shows in the shape the contract defines
- Screenshots attached

**Deliverables:** upload screen on staging; screenshots.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Fri 6 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Gold · **Kit:** Ship a feature

### E6. Build the project page on fake results

**Brief:** One page per project showing its uploads and runs, using fake data.

**Acceptance criteria:**

- Lists uploads and runs with status
- Uses the fake outputs from the contracts
- Screenshots attached

**Deliverables:** project page on staging; screenshots.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Fri 6 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Gold · **Kit:** Ship a feature

### E7. Set up the database and file storage

**Brief:** Real storage for users, uploads and runs, with uploaded files kept outside the code repo.

**Acceptance criteria:**

- Tables exist for users, uploads and runs
- Uploaded files are stored in access-controlled storage, never in Git
- Hosting region noted for the data protection check

**Deliverables:** database schema; storage setup notes.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** High · **Difficulty:** III Medium · **Deadline:** Mon 9 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Gold · **Kit:** Ship a feature

### E8. Test Gold's file receiver and reader with bad files

**Brief:** Try to break intake before real data arrives.

**Acceptance criteria:**

- Empty, wrong-type, oversized, duplicate and corrupt files each tried
- Every failure logged with steps to reproduce

**Deliverables:** test notes; bug list.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** High · **Difficulty:** II Easy · **Deadline:** Tue 10 Nov, 17:00 · **Estimate:** 3h · **Collaborators:** Gold · **Kit:** Fix a bug

### E9. Connect the upload screen to the real file receiver

**Brief:** Replace fake data with Gold's receiver.

**Acceptance criteria:**

- A file uploaded on screen reaches the receiver and is stored
- Rejected files show a clear message to the user

**Deliverables:** connected upload; screenshots.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Tue 10 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Gold · **Kit:** Ship a feature

### E10. Build real login and roles

**Brief:** Replace fake users with real accounts and make roles limit what each user can see.

**Acceptance criteria:**

- Real accounts sign in and out
- Each role sees only what it should
- Failed logins are logged

**Deliverables:** login and roles on staging; test notes.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** Critical · **Difficulty:** III Medium · **Deadline:** Wed 11 Nov, 17:00 · **Estimate:** 5h · **Collaborators:** Gold · **Kit:** Ship a feature

### E11. Build the BEME skeleton on fake quantities

**Brief:** Prove the Excel export works before real quantities exist.

**Acceptance criteria:**

- Produces an Excel file with item, description, unit, quantity, rate and amount columns from fake data
- The file opens in Excel

**Deliverables:** BEME generator; sample Excel file.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** High · **Difficulty:** III Medium · **Deadline:** Thu 12 Nov, 17:00 · **Estimate:** 5h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### E12. Build the first results viewer on real output

**Brief:** Show the intake report and terrain result from a real run.

**Acceptance criteria:**

- A real run's intake report and terrain result display on the project page
- Screenshots attached

**Deliverables:** results viewer on staging; screenshots.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** Critical · **Difficulty:** IV Hard · **Deadline:** Fri 13 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Gold · **Kit:** Ship a feature

### E13. Build the profile chart, section viewer and quantities table

**Brief:** Simple tables and basic charts for the design outputs, with no polish.

**Acceptance criteria:**

- Profile chart, cross-section table and quantities table show real output
- Screenshots attached

**Deliverables:** viewers on staging; screenshots.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** High · **Difficulty:** III Medium · **Deadline:** Mon 16 Nov, 17:00 · **Estimate:** 5h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### E14. Map quantities to BEME items

**Brief:** Connect the real quantities to the BEME rows.

**Acceptance criteria:**

- Every quantity maps to a BEME item
- Placeholder rates are clearly marked until Mastodon confirms them

**Deliverables:** mapping; sample BEME.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** High · **Difficulty:** III Medium · **Deadline:** Mon 16 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### E15. Add encryption, audit log and backups

**Brief:** The security basics the agreement requires.

**Acceptance criteria:**

- Data encrypted in transit, and at rest where the host allows
- Uploads and runs logged with who and when
- A backup restore tested once

**Deliverables:** security notes; restore test result.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** High · **Difficulty:** IV Hard · **Deadline:** Tue 17 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Gold · **Kit:** Ship a feature

### E16. Finish and test the Excel BEME

**Brief:** Make the BEME match what Mastodon expects.

**Acceptance criteria:**

- Layout matches Mastodon's sample
- Amounts equal quantity times rate on every row

**Deliverables:** finished generator; sample file; test notes.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** High · **Difficulty:** III Medium · **Deadline:** Tue 17 Nov, 17:00 · **Estimate:** 4h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### E17. Build the PDF pilot report

**Brief:** The report Mastodon reads to judge the pilot.

**Acceptance criteria:**

- Shows inputs, assumptions, rule values, results and the four metrics
- Opens as a PDF with no layout errors

**Deliverables:** report generator; sample PDF.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** High · **Difficulty:** IV Hard · **Deadline:** Wed 18 Nov, 17:00 · **Estimate:** 7h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### E18. Add the export buttons

**Brief:** Let users download the BEME and the report from the project page.

**Acceptance criteria:**

- Both files download from the project page
- Only allowed roles see the buttons

**Deliverables:** export buttons on staging; screenshots.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** High · **Difficulty:** II Easy · **Deadline:** Thu 19 Nov, 17:00 · **Estimate:** 3h · **Collaborators:** Kabiru · **Kit:** Ship a feature

### E19. Fix app bugs and handle every state

**Brief:** Clean up errors before the final demo.

**Acceptance criteria:**

- All bugs from Kabiru's testing are fixed
- Loading, empty and error states are handled
- Works on a mid-range phone and a slow connection

**Deliverables:** fixes; screenshots.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** High · **Difficulty:** III Medium · **Deadline:** Thu 19 Nov, 17:00 · **Estimate:** 6h · **Collaborators:** Kabiru · **Kit:** Polish the UI

### E20. Do the final staging check

**Brief:** Confirm staging is stable before the MVP is submitted.

**Acceptance criteria:**

- Final demo runs on staging with the pilot data
- Screenshots saved as a fallback

**Deliverables:** check notes; fallback screenshots.

**Settings:** **Project:** Strider · **Assignee:** Edidiong · **Priority:** Critical · **Difficulty:** II Easy · **Deadline:** Fri 20 Nov, 12:00 · **Estimate:** 2h · **Collaborators:** Kabiru, Gold · **Kit:** Write the docs
