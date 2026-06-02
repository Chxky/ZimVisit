const fs = require('fs');

// Fix government-portal/src/components/LiveAuditDemo.tsx
let govAuditPath = 'apps/government-portal/src/components/LiveAuditDemo.tsx';
if (fs.existsSync(govAuditPath)) {
  let govAuditCode = fs.readFileSync(govAuditPath, 'utf8');
  govAuditCode = govAuditCode.replace(/res\.estimatedLeakage/g, '(res as any).estimatedLeakage');
  govAuditCode = govAuditCode.replace(/res\.nonCompliantBookings/g, '(res as any).nonCompliantBookings');
  fs.writeFileSync(govAuditPath, govAuditCode);
}

// Fix operator-dashboard/src/components/LiveAuditDemo.tsx
let opAuditPath = 'apps/operator-dashboard/src/components/LiveAuditDemo.tsx';
if (fs.existsSync(opAuditPath)) {
  let opAuditCode = fs.readFileSync(opAuditPath, 'utf8');
  opAuditCode = opAuditCode.replace(/res\.complianceRate/g, '(res as any).complianceRate');
  opAuditCode = opAuditCode.replace(/res\.totalReports/g, '(res as any).totalReports');
  opAuditCode = opAuditCode.replace(/res\.compliant/g, '(res as any).compliant');
  opAuditCode = opAuditCode.replace(/res\.flagged/g, '(res as any).flagged');
  fs.writeFileSync(opAuditPath, opAuditCode);
}

// Fix operator-dashboard Layout unused import
let layoutPath = 'apps/operator-dashboard/src/components/Layout.tsx';
if (fs.existsSync(layoutPath)) {
  let layoutCode = fs.readFileSync(layoutPath, 'utf8');
  layoutCode = layoutCode.replace(/const \{ colorBgContainer \} = theme\.useToken\(\);\r?\n/, '');
  fs.writeFileSync(layoutPath, layoutCode);
}

console.log('Fixed Audit Demos!');
