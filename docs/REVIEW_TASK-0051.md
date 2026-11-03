TASK-0051 · E1 Review of the stage contracts

Reviewer: Edidiong Antia · Lead: Kabiru Nuhu Shuaibu · Repo: Spectratechorg/DariusOS (commit f87670f)

Scope. I read all 10 files in docs/contracts/ against docs/architecture.md, docs/testing.md, docs/decisions.md, config/engineering_rules.json and the Pydantic models in backend/app/schemas/. I re-did the arithmetic in the JSON examples. I did not run the code or the tests, and I have not seen the real pilot data from Mastodon.

Severity. High = would give wrong numbers or break integration. Fix = needs a decision or wording before building. Minor = tidy-up.

Verdict: changes requested. The contracts are clear and well organised, and ADR 005 (one set of cross-sections feeds both the drawings and the quantities) is a sound design. But the contracts and the code disagree on names and structure, and a few examples contradict their own numbers or the golden tests. Details below.

A. Issues that affect every contract

A1 · High · The contract docs and the Pydantic schemas do not match. architecture.md says stages exchange "typed Pydantic contracts in backend/app/schemas/ and documented in docs/contracts/", but the two disagree on names and shape almost everywhere:

Contract	Docs say	Code says
02	duplicate_points_removed, spikes_removed, holes_removed, status, summary, density_pts_per_m2	duplicate_count, spikes_count, holes_count, verdict, summary_text, density_pts_m2
03	flat, elevation_grid_url	nested grid_metadata, grid_storage_path
04	alignment_elements, max_allowed_grade_percent	curves, max_allowable_ground_grade_percent
05	vertical_pvis	pvis
06	cross_sections, section_type, centreline_ground_z, has project_id	sections, section_class, ground_z, no project_id
07	schedule, incremental_cut_volume_m3	intervals, incremental_cut_m3
08	survey_file_sha256, rules_sha256, route_params_hash, triggered_by	survey_file_hash, engineering_rules_hash, none of the other two
09	bill_items, item_number, rate, grand_total	items, item_code, unit_rate, grand_total_estimated
10	nested (input_audit, geometry_summary, …)	flat; accuracy_verification vs accuracy_benchmarks

The code also has fields the docs lack (is_grade_compliant, factored_fill_volume_m3, mass_haul_balance, topsoil_strip_width_m, SKIPPED/FAILED run states). The web app receives the code's shape, so anyone building against the docs will be wrong.
Suggestion: pick one source of truth and generate the other. The simplest option is to generate docs/contracts/*.md from the Pydantic models (model_json_schema()), so they cannot drift.

A2 · High · Currency. The agreement (clause 1.2) says amounts are in naira (₦). Contract 09, contract 10 (estimated_cost_usd) and engineering_rules.json all use USD placeholder rates. Please confirm USD is a deliberate placeholder for the MVP and say when it switches to NGN. I would make currency a field, not part of a field name.

A3 · High · The last part of the road is never measured. Stations run at 20 m intervals from 0, so a 1,118.03 m road gets stations 0 to 1,100 (56 sections, which matches the pilot report's total_cross_sections: 56). The last 18.03 m has no section, so its earthwork is not counted. The contracts do not say a final section is added at the end station. They should.

A4 · High · No approval state. The system's whole premise is that an engineer reviews and approves (agreement clause 18.2; the CEO report's approved/draft/superseded statuses). The contracts have disclaimer text but no field for status, approver, approval time or design revision. Nothing records that a registered engineer actually confirmed the rules, rates or results. ADR 004 says the rules file must be engineer-confirmed, but nothing says how that is recorded.

A5 · Fix · The contracts do not cover the HTTP layer. The web app (component 6) needs the endpoint list, auth, error shape, upload limits (testing.md mentions 400 and 413) and how downloads work (GET /exports/beme, /exports/pilot-report). The contracts only describe JSON bodies.

A6 · Fix · Enums and statuses are mostly undefined. Allowed values are missing for file_format, quality verdict, section class, cut/fill type, balance status and run status. The code has them, and the contracts should list them.

B. Comments per contract

01 · Raw survey file

	•	Fix · Invariant 3 says duplicates are "rejected or linked". Pick one and say what the user sees (HTTP code, or the id of the existing file). testing.md only says "avoids redundant storage".
	•	Fix · The file_format values are not listed. Contract 02 mentions CSV, XYZ, LAS and LAZ, but the Pilot 1 document describes a CSV with Point ID, Easting, Northing, Elevation and Description. Confirm what Mastodon will actually supply. The Description column (Ground/Road) is not carried into the point cloud (code has an integer classification).
	•	Minor · Add the upload status values (PENDING, VALIDATED, REJECTED, in code only) and the size limit that triggers a 413.

02 · Standard point cloud

	•	Fix · The example is inconsistent. 50,000 points over 1,000 × 500 m is 0.1 points/m², not 1.0.
	•	Fix · "Survey density meets engineering minimum" gives no number. State the minimum and where it comes from.
	•	Fix · A "hole" in testing.md is a low outlier point, not a gap in coverage. Rename it or define it, and give the spike and hole thresholds (the IQR rule is only described in testing.md).
	•	Fix · The quality verdict values are not defined (code: PASSED, PASSED_WITH_WARNINGS, REJECTED). Can a user proceed on warnings?
	•	Fix · CRS: the code defaults to EPSG 32632 and allows none. Say what happens when the file's CRS is missing or different, and confirm the pilot site's CRS and datum.
	•	High (for the web app) · The contract embeds every point in the JSON. ADR 003 mentions files of 500,000+ points, which is too large for the API or the browser. State that points stay server-side and the API returns the summary only.

03 · Terrain surface

	•	Fix · No interpolation method is stated, and nothing says how the cell size is chosen or how nodata cells are handled.
	•	Fix · The grid orientation is not stated (is row 0 north or south?). The example (1001 columns for 1,000 m at 1 m) implies node-based cells. Say so.
	•	Fix · get_elevation(...) and get_corridor_elevation_profile(...) are Python methods, not part of a wire format. Mark them as internal, and state what happens outside the bounding box.
	•	Minor · Add survey_file_id and the survey hash (the code has them) for traceability.

04 · Horizontal alignment

	•	Fix · max_allowed_grade_percent (12 here) and max_allowable_grade_percent (8 in contract 05) look like the same field but are different limits: 12 is the maximum ground grade along the route and 8 is the maximum design grade (see engineering_rules.json). Use the code's …_ground_grade_… naming.
	•	Fix · The contract only shows start and end points, but the code accepts intermediate PIs. State all route inputs, because M6 ("a different route is selected") depends on them.
	•	Fix · Say how the centreline is made (straight line with curves at PIs, or terrain-following) and what happens when the ground grade limit is exceeded (fail, warn or re-route). The code has is_grade_compliant, the contract does not.
	•	Fix · design_speed_kph and min_radius_m are both given. Is the radius derived from the speed under a standard, or independent?
	•	Minor · The example length equals the straight-line distance (1,118.03 m) while it includes a 170 m curve. The listed elements also stop at 620 m. State that elements must cover 0 to total length without gaps.
	•	Minor · State the bearing convention (63.43° is clockwise from north) and that only circular curves, no spirals, are supported in the MVP.

05 · Longitudinal profile

	•	Fix · The example conflicts with itself: the PVI at station 0 has elevation 100.0, but the profile point at station 0 has design_elevation_m 99.85. Which is authoritative?
	•	Fix · How are the PVIs chosen (automatic or given)? The code has target_elevation_offset_m in the run request and default_roadbed_target_offset_m in the rules, but the contract mentions neither.
	•	Fix · State what happens when the 8% limit cannot be met, and the minimum K values (crest 15, sag 10 in the rules file) with their source.
	•	Minor · Put the sign rule in the contract (difference_m = design − ground, positive = fill) and list the AT_GRADE value the code allows.

06 · Cross-sections

	•	High · The example contradicts its own slope. With cut_slope_v_to_h: 0.6667, a 2 m cut should daylight at ±8 m (area 26 m²), but the template reaches daylight at ±7 m (a 1V:1H slope) with area 24 m². The ±7 m and 24 m² figures come from Golden Case 1 in testing.md, which uses 1V:1H, while the rules file uses 0.6667. As written, the golden test does not exercise the real default slope.
	•	Fix · The template is flat across the road in the example, but the rules set a camber of −2.5% and a shoulder slope of −4%, with shoulder breaks at ±3.5 m. Say whether the design level is formation or pavement top, and whether the template includes camber, shoulders and the side ditches described in architecture.md.
	•	Fix · The example ground profile spans ±15 m, but the rules sample ±25 m. State what happens when the daylight point is not found within that width (steep cut or fill).
	•	Fix · Define how a mixed (side-hill) section is classified and confirm that both areas are reported (code has TRANSITION and AT_GRADE; Golden Case 3 depends on it).
	•	Minor · State that negative offsets are left of the centreline.

07 · Earthwork quantities

	•	High · The bulking (1.15) and shrinkage (0.90) factors are listed, but the example's net (2,400 − 1,950 = 450) ignores them. Say whether cut is in-situ volume, whether fill is compacted volume, and whether the net and the balance status use the factors (the code adds factored_fill_volume_m3). Also say whether each factor multiplies or divides.
	•	Fix · The schedule stores only the end areas, so it cannot show that the prismoidal correction was applied. State the formula and when it applies. The method name also differs between the contract and the code ("…Correction" vs "…Analysis").
	•	Fix · Topsoil: say whether the stripped volume is taken out of the cut or counted on top (double-count risk), and which depth and width it uses.
	•	Fix · The purpose mentions "cumulative mass haul", but the schedule only has the cumulative net. Decide whether the MVP needs mass-haul ordinates and balance points or only the balance status, and define when the status is BALANCED.
	•	Minor · The example schedule covers 0 to 20 m and totals 2,400 m³, which is the 100 m golden case, not the 1,118 m road in contracts 04 to 06.

08 · Regeneration manifest

	•	High (for the web app) · Runs can be asynchronous (ADR 003: larger files go through RQ), but the contract has no QUEUED or RUNNING state, no progress, and no failure message. The code adds SKIPPED and FAILED, which the contract lacks. The UI needs all of these.
	•	Fix · Document which inputs invalidate which stages (the dependency map). architecture.md says a unit-rate change should re-run only the exports, which means rates must be a run input. The run request has no rates field.
	•	Fix · Align the field names (A1). The contract has route_params_hash, triggered_by and started_at, which the code lacks, and the code has cache_key and summary, which the contract lacks.
	•	Minor · code_version is 1.0.0-mvp in the examples but 0.1.0-mvp in the health check. Reproducibility also needs the library versions pinned.

09 · BEME export

	•	High · Traceability: the contract says it links to the earthwork calculations but has no run_id or design revision. The code adds the survey and rules hashes and the code version, so the contract should too.
	•	High · The example shows 3 items, but the rules file has 7 (topsoil 1.02, sub-base 3.01, wearing course 3.02 and ditch 4.01 as well). List the full item set and the source field for each quantity. The pavement and ditch quantities have no source in contracts 04 to 07.
	•	High (yours) · Where do unit rates live per project, and who edits them (a registered engineer)? This is the BEME UI (component 7) and also a run input (see 08).
	•	Fix · Item 1.01 uses 11,180.3 m², which is 1,118.03 m × 10 m, the formation width. Clearing should normally cover the daylight width. Define the clearance width.
	•	Minor · Add the section groupings and subtotals (the Pilot 1 document lists them) and the rounding rule. The architecture says the Excel file uses native formulas, so say which value wins if they differ.
	•	See A2 for the currency.

10 · Pilot report

	•	High · The only accuracy cases are synthetic golden cases. The agreement (M8) and Kabiru's plan call for checks against the real site, including elevation error against control points, failed runs, and a named engineer or surveyor who verified. None of those fields exist.
	•	High · pass has no tolerance. State the acceptable discrepancy percentage.
	•	Fix · min_curve_radius_m: 150 is the design limit, but the actual minimum radius in contract 04's example is 250. Say which is meant.
	•	Fix · survey_bounds is an unlabelled array, while contract 02 uses a keyed object. Use the same shape.
	•	Fix · No approval or sign-off block (A4). Define what "turnaround time" measures (upload to BEME, or only the pipeline stages).
	•	See A1, A2, A3 (structure, estimated_cost_usd, and the 56-section count).

C. Questions for Kabiru

	1.	Contract docs or Pydantic schemas: which is the source of truth, and can the docs be generated from the code (A1)?
	2.	Is USD a deliberate MVP placeholder, and when does the BEME move to ₦ (A2)?
	3.	Can a final section always be added at the end station (A3)?
	4.	Which golden-case slope is right: 1V:1H or the rules file's 0.6667 (06)?
	5.	Are the bulking and shrinkage factors applied to the net and the balance (07)?
	6.	Where do unit rates live per project, and who may edit them (09 and 08)?
	7.	How will accuracy be shown on the real pilot site: tolerance, control points, who verifies (10)?
	8.	What is the pilot site's CRS and datum, and what file format will Mastodon send (01, 02)?

D. Approval note (draft)

TASK-0051 · Contract review · changes requested.
I reviewed all 10 contracts in docs/contracts/ against the architecture, testing and decisions docs, the engineering rules file and the backend schemas. I am not approving yet. Before the build starts I need the contract docs and the schemas aligned (A1), a decision on currency (A2), a fix for the last-section gap (A3), the slope conflict in contract 06 resolved, the factor handling in contract 07 defined, and the traceability and rates questions in contract 09 answered. The full comments are attached, and the questions are in section C. I will re-review and approve once these are agreed.
