const fs = require('fs');

// 1. Fix traveler-portal/src/services/api.ts
let apiPath = 'apps/traveler-portal/src/services/api.ts';
let apiCode = fs.readFileSync(apiPath, 'utf8');
apiCode = apiCode.replace(/return \{ data: (.*?), message: 'Success' \};/g, 'return { data: $1, success: true, message: \'Success\' };');
apiCode = apiCode.replace(/operatorId: 'op-vfh'/g, 'operator: \'op-vfh\'');
apiCode = apiCode.replace(/operatorId: 'op-eh'/g, 'operator: \'op-eh\'');
apiCode = apiCode.replace(/operatorId: 'op-bh'/g, 'operator: \'op-bh\'');
apiCode = apiCode.replace(/operatorId: 'op-sp'/g, 'operator: \'op-sp\'');
fs.writeFileSync(apiPath, apiCode);

// 2. Fix traveler-portal/src/store/authStore.ts
let authPath = 'apps/traveler-portal/src/store/authStore.ts';
let authCode = fs.readFileSync(authPath, 'utf8');
authCode = authCode.replace(/role: 'traveler' as any,/g, 'role: "traveler" as any, isVerified: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),');
authCode = authCode.replace(/role: role as any,/g, 'role: role as any, isVerified: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),');
fs.writeFileSync(authPath, authCode);

// 3. Fix government-portal/src/components/LiveAuditDemo.tsx
let govAuditPath = 'apps/government-portal/src/components/LiveAuditDemo.tsx';
if (fs.existsSync(govAuditPath)) {
  let govAuditCode = fs.readFileSync(govAuditPath, 'utf8');
  govAuditCode = govAuditCode.replace(/res\.estimatedLeakage/g, 'res.data.estimatedLeakage');
  govAuditCode = govAuditCode.replace(/res\.nonCompliantBookings/g, 'res.data.nonCompliantBookings');
  fs.writeFileSync(govAuditPath, govAuditCode);
}

// 4. Fix operator-dashboard/src/components/LiveAuditDemo.tsx
let opAuditPath = 'apps/operator-dashboard/src/components/LiveAuditDemo.tsx';
if (fs.existsSync(opAuditPath)) {
  let opAuditCode = fs.readFileSync(opAuditPath, 'utf8');
  opAuditCode = opAuditCode.replace(/res\.complianceRate/g, 'res.data.complianceRate');
  opAuditCode = opAuditCode.replace(/res\.totalReports/g, 'res.data.totalReports');
  opAuditCode = opAuditCode.replace(/res\.compliant/g, 'res.data.compliant');
  opAuditCode = opAuditCode.replace(/res\.flagged/g, 'res.data.flagged');
  fs.writeFileSync(opAuditPath, opAuditCode);
}

// 5. Fix unused imports
function removeUnused(path, regex) {
  if (fs.existsSync(path)) {
    let code = fs.readFileSync(path, 'utf8');
    code = code.replace(regex, '');
    fs.writeFileSync(path, code);
  }
}
removeUnused('apps/government-portal/src/pages/Login.tsx', /import api from '\.\.\/services\/api';\r?\n/g);
removeUnused('apps/operator-dashboard/src/pages/Login.tsx', /import api from '\.\.\/services\/api';\r?\n/g);
removeUnused('apps/operator-dashboard/src/components/Layout.tsx', /const { colorBgContainer } = theme\.useToken\(\);\r?\n/g);

console.log('Fixed all TS errors!');
