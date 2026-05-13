import re
import os

css_path = r"d:\New folder (3)\SentinelAI\frontend\app\globals.css"
with open(css_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('--terminal-bg: #040508;', '--terminal-bg: #040508;\n  --invert-rgb: 255, 255, 255;')
content = content.replace('--terminal-bg: #1e293b;', '--terminal-bg: #1e293b;\n    --invert-rgb: 0, 0, 0;')

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(content)

tsx_path = r"d:\New folder (3)\SentinelAI\frontend\components\analyzer\AnalyzerSection.tsx"
with open(tsx_path, 'r', encoding='utf-8') as f:
    tsx = f.read()

# Fix safe, warn, danger, accent, and white rgba calls
tsx = re.sub(r'rgba\(0,\s*230,\s*118,\s*([0-9.]+)\)', r'rgba(var(--safe-rgb), \1)', tsx)
tsx = re.sub(r'rgba\(255,\s*170,\s*0,\s*([0-9.]+)\)', r'rgba(var(--warn-rgb), \1)', tsx)
tsx = re.sub(r'rgba\(255,\s*59,\s*59,\s*([0-9.]+)\)', r'rgba(var(--danger-rgb), \1)', tsx)
tsx = re.sub(r'rgba\(0,\s*229,\s*255,\s*([0-9.]+)\)', r'rgba(var(--accent-rgb), \1)', tsx)
tsx = re.sub(r'rgba\(255,\s*255,\s*255,\s*([0-9.]+)\)', r'rgba(var(--invert-rgb), \1)', tsx)

with open(tsx_path, 'w', encoding='utf-8') as f:
    f.write(tsx)

print("Updated globals.css and fixed ALL rgba values in AnalyzerSection.tsx")
