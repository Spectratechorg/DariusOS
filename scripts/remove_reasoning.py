import re

# 1. Sidebar.tsx
with open('frontend/src/components/Sidebar.tsx', 'r', encoding='utf-8') as f:
    sidebar = f.read()

old_sidebar_stages = """  const pipelineStages: { id: StageId; number: number; label: string }[] = [
    { id: 'setup', number: 1, label: 'Project setup' },
    { id: 'survey', number: 2, label: 'Survey and validation' },
    { id: 'terrain', number: 3, label: 'Terrain' },
    { id: 'reasoning', number: 4, label: 'AI reasoning' },
    { id: 'design', number: 5, label: 'Design engine' },
    { id: 'drawings', number: 6, label: 'Drawings' },
    { id: 'beme', number: 7, label: 'BEME and report' },
  ];"""

new_sidebar_stages = """  const pipelineStages: { id: StageId; number: number; label: string }[] = [
    { id: 'setup', number: 1, label: 'Project setup' },
    { id: 'survey', number: 2, label: 'Survey and validation' },
    { id: 'terrain', number: 3, label: 'Terrain' },
    { id: 'design', number: 4, label: 'Design engine' },
    { id: 'drawings', number: 5, label: 'Drawings' },
    { id: 'beme', number: 6, label: 'BEME and report' },
  ];"""

sidebar_fixed = sidebar.replace(old_sidebar_stages.replace('\n', '\r\n'), new_sidebar_stages.replace('\n', '\r\n'))
if sidebar_fixed == sidebar:
    sidebar_fixed = sidebar.replace(old_sidebar_stages, new_sidebar_stages)

with open('frontend/src/components/Sidebar.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(sidebar_fixed)
print("Updated Sidebar.tsx")


# 2. StepperBar.tsx
with open('frontend/src/components/StepperBar.tsx', 'r', encoding='utf-8') as f:
    stepper = f.read()

old_stepper_steps = """  const steps: { id: StageId; number: number; label: string }[] = [
    { id: 'setup', number: 1, label: 'Setup' },
    { id: 'survey', number: 2, label: 'Survey' },
    { id: 'terrain', number: 3, label: 'Terrain' },
    { id: 'reasoning', number: 4, label: 'AI reasoning' },
    { id: 'design', number: 5, label: 'Design' },
    { id: 'drawings', number: 6, label: 'Drawings' },
    { id: 'beme', number: 7, label: 'BEME and report' },
  ];"""

new_stepper_steps = """  const steps: { id: StageId; number: number; label: string }[] = [
    { id: 'setup', number: 1, label: 'Setup' },
    { id: 'survey', number: 2, label: 'Survey' },
    { id: 'terrain', number: 3, label: 'Terrain' },
    { id: 'design', number: 4, label: 'Design' },
    { id: 'drawings', number: 5, label: 'Drawings' },
    { id: 'beme', number: 6, label: 'BEME and report' },
  ];"""

old_stage_order = """  const stageOrder: Record<StageId, number> = {
    overview: 5,
    setup: 1,
    survey: 2,
    terrain: 3,
    reasoning: 4,
    design: 5,
    drawings: 6,
    beme: 7,
    monitoring: 7,
  };"""

new_stage_order = """  const stageOrder: Record<StageId, number> = {
    overview: 4,
    setup: 1,
    survey: 2,
    terrain: 3,
    reasoning: 4,
    design: 4,
    drawings: 5,
    beme: 6,
    monitoring: 6,
  };"""

stepper_fixed = stepper.replace(old_stepper_steps.replace('\n', '\r\n'), new_stepper_steps.replace('\n', '\r\n'))
if stepper_fixed == stepper:
    stepper_fixed = stepper.replace(old_stepper_steps, new_stepper_steps)

stepper_fixed2 = stepper_fixed.replace(old_stage_order.replace('\n', '\r\n'), new_stage_order.replace('\n', '\r\n'))
if stepper_fixed2 == stepper_fixed:
    stepper_fixed2 = stepper_fixed.replace(old_stage_order, new_stage_order)

with open('frontend/src/components/StepperBar.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(stepper_fixed2)
print("Updated StepperBar.tsx")


# 3. TopBar.tsx
with open('frontend/src/components/TopBar.tsx', 'r', encoding='utf-8') as f:
    topbar = f.read()

# Update breadcrumbs
topbar = re.sub(
    r"case 'terrain':\s*return \{ subtitle: 'STAGE 3 · TERRAIN ENGINE', title: 'Existing terrain' \};\s*case 'reasoning':\s*return \{ subtitle: 'STAGE 4 · INTELLIGENCE ENGINE', title: 'AI reasoning and engineer review' \};\s*case 'design':\s*return \{ subtitle: 'STAGE 5 · ENGINEERING ENGINE AND VALIDATION · REVISION C', title: 'Design engine' \};\s*case 'drawings':\s*return \{ subtitle: 'STAGE 6 · CAD ENGINE · REVISION C', title: 'Engineering drawings' \};\s*case 'beme':\s*return \{ subtitle: 'STAGE 7 · QUANTITY ENGINE, BEME ENGINE AND REPORT', title: 'Quantities and BEME' \};",
    """case 'terrain':
        return { subtitle: 'STAGE 3 · TERRAIN ENGINE', title: 'Existing terrain' };
      case 'design':
      case 'reasoning':
        return { subtitle: 'STAGE 4 · ENGINEERING ENGINE AND VALIDATION · REVISION C', title: 'Design engine' };
      case 'drawings':
        return { subtitle: 'STAGE 5 · CAD ENGINE · REVISION C', title: 'Engineering drawings' };
      case 'beme':
        return { subtitle: 'STAGE 6 · QUANTITY ENGINE, BEME ENGINE AND REPORT', title: 'Quantities and BEME' };""",
    topbar
)

# Update getPrimaryAction
topbar = re.sub(
    r"case 'terrain':\s*return \{ label: 'Continue to AI reasoning', onClick: \(\) => setActiveStage\('reasoning'\) \};\s*case 'reasoning':\s*return \{ label: 'Continue to design engine', onClick: \(\) => setActiveStage\('design'\) \};",
    """case 'terrain':
        return { label: 'Continue to design engine', onClick: () => setActiveStage('design') };
      case 'reasoning':
        return { label: 'Continue to design engine', onClick: () => setActiveStage('design') };""",
    topbar
)

# Update getSecondaryAction
topbar = re.sub(
    r"case 'terrain':\s*return \{ label: 'Export contours', onClick: \(\) => setSnackbarMessage\('Contour shapefile and DXF contours exported\.'\) \};\s*case 'reasoning':\s*return \{ label: 'Reopen for changes', onClick: \(\) => setSnackbarMessage\('Parameter set v2 opened for engineer adjustments\.'\) \};",
    """case 'terrain':
        return { label: 'Export contours', onClick: () => setSnackbarMessage('Contour shapefile and DXF contours exported.') };
      case 'reasoning':
        return { label: 'Regenerate design', onClick: () => setSnackbarMessage('Pipeline regeneration executed.') };""",
    topbar
)

with open('frontend/src/components/TopBar.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(topbar)
print("Updated TopBar.tsx")


# 4. App.tsx
with open('frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

app = re.sub(
    r"case 'terrain':\s*return <TerrainView />;\s*case 'reasoning':\s*return <AiReasoningView />;",
    """case 'terrain':
        return <TerrainView />;
      case 'reasoning':
        return <DesignEngineView />;""",
    app
)

with open('frontend/src/App.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(app)
print("Updated App.tsx")


# 5. OverviewView.tsx
with open('frontend/src/views/OverviewView.tsx', 'r', encoding='utf-8') as f:
    overview = f.read()

old_pipeline = """  const pipelineStatus = [
    { num: 1, name: 'Project setup', desc: 'Road class, standards, pavement and drainage requirements set', engine: 'PROJECT CONTEXT', status: 'Complete', color: '#10B981', stageId: 'setup' },
    { num: 2, name: 'Survey and validation', desc: '1,842 points checked, 3 warnings acknowledged', engine: 'VALIDATION', status: 'Complete', color: '#10B981', stageId: 'survey' },
    { num: 3, name: 'Terrain', desc: 'TIN, contours, existing-ground profile and slope analysis', engine: 'TERRAIN ENGINE', status: 'Complete', color: '#10B981', stageId: 'terrain' },
    { num: 4, name: 'AI reasoning', desc: 'Parameter set approved by the engineering lead', engine: 'INTELLIGENCE ENGINE', status: 'Approved', color: '#10B981', stageId: 'reasoning' },
    { num: 5, name: 'Design engine', desc: '22 of 27 checks pass, 1 needs review', engine: 'ENGINEERING ENGINE', status: 'In progress', color: '#38BDF8', stageId: 'design' },
    { num: 6, name: 'Drawings', desc: 'Plan, profile and cross-sections as DXF and PDF', engine: 'CAD ENGINE', status: 'Waiting', color: '#64748B', stageId: 'drawings' },
    { num: 7, name: 'BEME and report', desc: 'Quantity times rate, traced to one design revision', engine: 'QUANTITY AND BEME', status: 'Draft', color: '#F59E0B', stageId: 'beme' },
  ];"""

new_pipeline = """  const pipelineStatus = [
    { num: 1, name: 'Project setup', desc: 'Road class, standards, pavement and drainage requirements set', engine: 'PROJECT CONTEXT', status: 'Complete', color: '#10B981', stageId: 'setup' },
    { num: 2, name: 'Survey and validation', desc: `${pointsCount.toLocaleString()} points checked, warnings acknowledged`, engine: 'VALIDATION', status: 'Complete', color: '#10B981', stageId: 'survey' },
    { num: 3, name: 'Terrain', desc: 'TIN, contours, existing-ground profile and slope analysis', engine: 'TERRAIN ENGINE', status: 'Complete', color: '#10B981', stageId: 'terrain' },
    { num: 4, name: 'Design engine', desc: '22 of 27 checks pass, 1 needs review', engine: 'ENGINEERING ENGINE', status: 'In progress', color: '#38BDF8', stageId: 'design' },
    { num: 5, name: 'Drawings', desc: 'Plan, profile and cross-sections as DXF and PDF', engine: 'CAD ENGINE', status: 'Waiting', color: '#64748B', stageId: 'drawings' },
    { num: 6, name: 'BEME and report', desc: 'Quantity times rate, traced to one design revision', engine: 'QUANTITY AND BEME', status: 'Draft', color: '#F59E0B', stageId: 'beme' },
  ];"""

overview_fixed = overview.replace(old_pipeline.replace('\n', '\r\n'), new_pipeline.replace('\n', '\r\n'))
if overview_fixed == overview:
    overview_fixed = overview.replace(old_pipeline, new_pipeline)

# Update item 3 in OverviewView
overview_fixed = overview_fixed.replace("AI reasoning · three alternatives compared", "Design engine · geometric curve alternatives")
overview_fixed = overview_fixed.replace("onClick={() => setActiveStage('reasoning')}", "onClick={() => setActiveStage('design')}")

with open('frontend/src/views/OverviewView.tsx', 'w', encoding='utf-8', newline='') as f:
    f.write(overview_fixed)
print("Updated OverviewView.tsx")


# 6. TerrainView.tsx
with open('frontend/src/views/TerrainView.tsx', 'r', encoding='utf-8') as f:
    terrain = f.read()

terrain = terrain.replace("Detected from slope and elevation variation. This feeds the project profile the AI reads next.", "Detected from slope and elevation variation. This feeds the geometric alignment calculations the design engine reads next.")

# Add bottom navigation button to TerrainView if not present
if "Proceed to Design Engine" not in terrain:
    old_end = """            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );"""
    new_end = """            </Box>
          </Card>

          {/* Proceed to Design Engine Card */}
          <Card sx={{ p: 2.5, mt: 3, backgroundColor: '#0F1626', border: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
              Proceed to Design
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Terrain TIN surface ready. Generate longitudinal profile and horizontal alignments.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setActiveStage('design')}
              sx={{
                backgroundColor: '#10B981',
                color: '#0B0F19',
                fontWeight: 700,
                textTransform: 'none',
                py: 1,
                '&:hover': { backgroundColor: '#059669' },
              }}
            >
              Continue to Design Engine (Stage 4)
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );"""
    terrain_fixed = terrain.replace(old_end.replace('\n', '\r\n'), new_end.replace('\n', '\r\n'))
    if terrain_fixed == terrain:
        terrain_fixed = terrain.replace(old_end, new_end)
    
    # Ensure ArrowForwardIcon is imported in TerrainView
    if "ArrowForwardIcon" not in terrain_fixed:
        terrain_fixed = terrain_fixed.replace("import React,", "import React,\nimport ArrowForwardIcon from '@mui/icons-material/ArrowForward';\nimport Button from '@mui/material/Button';\n")
        terrain_fixed = terrain_fixed.replace("import React,\nimport ArrowForwardIcon", "import ArrowForwardIcon")
    
    with open('frontend/src/views/TerrainView.tsx', 'w', encoding='utf-8', newline='') as f:
        f.write(terrain_fixed)
print("Updated TerrainView.tsx")
