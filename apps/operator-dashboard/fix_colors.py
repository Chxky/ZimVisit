import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replacements_layout = [
    ("background: 'rgba(15, 23, 42, 0.4)'", "background: '#ffffff'"),
    ("theme=\"dark\"", "theme=\"light\""),
    ("color: '#f8fafc'", "color: '#1e293b'"),
    ("borderRight: '1px solid rgba(255,255,255,0.05)'", "borderRight: '1px solid #e2e8f0'"),
    ("borderBottom: '1px solid rgba(255, 255, 255, 0.05)'", "borderBottom: '1px solid #e2e8f0'"),
    ("color: '#94a3b8'", "color: '#64748b'"),
]

replace_in_file(r'c:\Users\User\Desktop\Zim Visit\zimvisit\apps\operator-dashboard\src\components\Layout.tsx', replacements_layout)

replacements_dashboard = [
    ("color: '#f8fafc'", "color: '#1e293b'"),
    ("color: '#94a3b8'", "color: '#64748b'"),
    ("background: 'rgba(15, 23, 42, 0.9)'", "background: '#ffffff'"),
    ("border: '1px solid rgba(255, 255, 255, 0.1)'", "border: '1px solid #e2e8f0'"),
    ("boxShadow: '0 4px 12px rgba(0,0,0,0.5)'", "boxShadow: '0 4px 12px rgba(0,0,0,0.08)'"),
]

replace_in_file(r'c:\Users\User\Desktop\Zim Visit\zimvisit\apps\operator-dashboard\src\pages\Dashboard.tsx', replacements_dashboard)
