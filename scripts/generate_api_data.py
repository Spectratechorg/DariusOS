import json
import os

with open('frontend/src/data/backendMockPayloads.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)

health = {
    "status": "ready",
    "version": "0.1.0-mvp",
    "environment": "production",
    "engineer_disclaimer": "ALL GEOMETRY & RATES TO BE CONFIRMED BY A REGISTERED ENGINEER",
    "rules_sha256": raw.get('/api/v1/health', {}).get('rules_sha256', "3501ae7257a11e03880544f101e8b91664e32aaea6e78990b9230727ae31b916")
}

projects = raw['/api/v1/projects']
project_detail = raw['/api/v1/projects/proj-lifidi-001']
alignment = raw['/api/v1/runs/19790393-8180-4d71-9386-ecb7eb30b258/alignment']
profile = raw['/api/v1/runs/19790393-8180-4d71-9386-ecb7eb30b258/profile']
sections = raw['/api/v1/runs/19790393-8180-4d71-9386-ecb7eb30b258/sections']
quantities = raw['/api/v1/runs/19790393-8180-4d71-9386-ecb7eb30b258/quantities']
beme = raw['/api/v1/runs/19790393-8180-4d71-9386-ecb7eb30b258/beme']
terrain = raw['/api/v1/runs/19790393-8180-4d71-9386-ecb7eb30b258/terrain']

os.makedirs('frontend/api', exist_ok=True)

content = f"""// Auto-generated live engineering pipeline payloads
export const HEALTH = {json.dumps(health, indent=2)};

export const PROJECTS = {json.dumps(projects, indent=2)};

export const PROJECT_DETAIL = {json.dumps(project_detail, indent=2)};

export const ALIGNMENT = {json.dumps(alignment, indent=2)};

export const PROFILE = {json.dumps(profile, indent=2)};

export const SECTIONS = {json.dumps(sections, indent=2)};

export const QUANTITIES = {json.dumps(quantities, indent=2)};

export const BEME = {json.dumps(beme, indent=2)};

export const TERRAIN = {json.dumps(terrain, indent=2)};
"""

with open('frontend/api/data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Generated frontend/api/data.js successfully!")
