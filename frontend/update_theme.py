import re

css_path = r"d:\New folder (3)\SentinelAI\frontend\app\globals.css"
with open(css_path, 'r', encoding='utf-8') as f:
    content = f.read()

theme_css = """
/* SENTINEL AI PREMIUM THEME SYSTEM */
:root {
  --bg: #060810;
  --bg-gradient: linear-gradient(180deg, #0a0e17 0%, #060810 100%);
  --surface: #0d1117;
  --surface2: #131920;
  --border: #1c2535;
  
  --accent: #00e5ff;
  --accent-rgb: 0, 229, 255;
  
  --safe: #00e676;
  --safe-rgb: 0, 230, 118;
  
  --warn: #ffaa00;
  --warn-rgb: 255, 170, 0;
  
  --danger: #ff3b3b;
  --danger-rgb: 255, 59, 59;
  
  --text: #dde4f0;
  --muted: #4a5568;
  --faint: #1a2235;
  
  --glass-white: rgba(255, 255, 255, 0.03);
  --glass-black: rgba(0, 0, 0, 0.5);
  --terminal-bg: #040508;
}

@media (prefers-color-scheme: light) {
  :root {
    --bg: #f4f7fb;
    --bg-gradient: linear-gradient(180deg, #f8fafd 0%, #edf1f6 100%);
    --surface: #ffffff;
    --surface2: #f8fafc;
    --border: #e2e8f0;
    
    --accent: #0284c7;
    --accent-rgb: 2, 132, 199;
    
    --safe: #10b981;
    --safe-rgb: 16, 185, 129;
    
    --warn: #f59e0b;
    --warn-rgb: 245, 158, 11;
    
    --danger: #ef4444;
    --danger-rgb: 239, 68, 68;
    
    --text: #0f172a;
    --muted: #64748b;
    --faint: #cbd5e1;
    
    --glass-white: rgba(0, 0, 0, 0.02);
    --glass-black: rgba(255, 255, 255, 0.8);
    --terminal-bg: #1e293b;
  }
}

body {
  background: var(--bg);
  background-image: var(--bg-gradient);
  color: var(--text);
  transition: background 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.6s ease;
}

/* Base resets */
"""

# Find the start of the body tag to replace the initial root variables
# We'll use regex to replace everything from :root { ... } up to body { ... }
content = re.sub(r':root\s*\{[^}]*\}\s*body\s*\{[^}]*\}', theme_css, content, count=1, flags=re.MULTILINE)

# Also remove the light theme block I added at the end previously
content = re.sub(r'/\* LIGHT THEME VARIABLES \*/.*', '', content, flags=re.DOTALL)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated globals.css with smooth premium theme.")
