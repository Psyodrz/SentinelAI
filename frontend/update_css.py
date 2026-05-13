import re

css_path = r"d:\New folder (3)\SentinelAI\frontend\app\globals.css"
with open(css_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Navbar background
content = content.replace('background: rgba(6,8,16,0.92);', 'background: var(--nav-bg);')

# We need to add --nav-bg to :root and light theme
root_additions = """
  --nav-bg: rgba(6, 8, 16, 0.92);
  --terminal-text: #dde4f0;
  --terminal-muted: #8b9bb4;
"""
light_additions = """
    --nav-bg: rgba(248, 250, 253, 0.92);
    --terminal-text: #f8fafc;
    --terminal-muted: #94a3b8;
"""

# Inject into :root
content = re.sub(r'(--terminal-bg: #040508;\s*--invert-rgb: 255, 255, 255;)', r'\1' + root_additions, content)

# Inject into light theme
content = re.sub(r'(--terminal-bg: #1e293b;\s*--invert-rgb: 0, 0, 0;)', r'\1' + light_additions, content)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated globals.css for nav-bg and terminal text colors")
