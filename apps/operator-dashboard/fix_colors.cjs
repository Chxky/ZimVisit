const fs = require('fs');

function replaceInFile(filepath, replacements) {
    let content = fs.readFileSync(filepath, 'utf-8');
    for (const [oldStr, newStr] of replacements) {
        // use split join for global replacement
        content = content.split(oldStr).join(newStr);
    }
    fs.writeFileSync(filepath, content, 'utf-8');
}

const replacementsLayout = [
    ["background: 'rgba(15, 23, 42, 0.4)'", "background: '#ffffff'"],
    ["theme=\"dark\"", "theme=\"light\""],
    ["color: '#f8fafc'", "color: '#1e293b'"],
    ["borderRight: '1px solid rgba(255,255,255,0.05)'", "borderRight: '1px solid #e2e8f0'"],
    ["borderBottom: '1px solid rgba(255, 255, 255, 0.05)'", "borderBottom: '1px solid #e2e8f0'"],
    ["color: '#94a3b8'", "color: '#64748b'"]
];

replaceInFile('src/components/Layout.tsx', replacementsLayout);

const replacementsDashboard = [
    ["color: '#f8fafc'", "color: '#1e293b'"],
    ["color: '#94a3b8'", "color: '#64748b'"],
    ["background: 'rgba(15, 23, 42, 0.9)'", "background: '#ffffff'"],
    ["border: '1px solid rgba(255, 255, 255, 0.1)'", "border: '1px solid #e2e8f0'"],
    ["boxShadow: '0 4px 12px rgba(0,0,0,0.5)'", "boxShadow: '0 4px 12px rgba(0,0,0,0.08)'"]
];

replaceInFile('src/pages/Dashboard.tsx', replacementsDashboard);
