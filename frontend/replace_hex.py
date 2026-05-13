import os
import re

components_dir = r"d:\New folder (3)\SentinelAI\frontend\components"

replacements = {
    '#ff3b3b': 'var(--danger)',
    '#ff6b6b': 'var(--danger)',
    '#ffaa00': 'var(--warn)',
    '#00e5ff': 'var(--accent)',
    '#00e676': 'var(--safe)',
    '#00a65a': 'var(--safe)',
    'rgba(0, 229, 255': 'rgba(var(--accent-rgb)',
    'rgba(255, 59, 59': 'rgba(var(--danger-rgb)',
    'rgba(255, 170, 0': 'rgba(var(--warn-rgb)',
    'rgba(0, 230, 118': 'rgba(var(--safe-rgb)'
}

for root, dirs, files in os.walk(components_dir):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            modified = False
            for old, new in replacements.items():
                if old in content:
                    content = content.replace(old, new)
                    modified = True
                    
            if modified:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {file}")
