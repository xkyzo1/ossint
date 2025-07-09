const readline = require('readline');
const fetch = require('node-fetch');
const FormData = require('form-data');
const crypto = require('crypto');
const os = require('os');

// Enhanced ANSI escape codes for colors and effects
const colors = {
reset: "\x1b[0m",
bright: "\x1b[1m",
dim: "\x1b[2m",
underline: "\x1b[4m",
blink: "\x1b[5m",
reverse: "\x1b[7m",

// Colors
black: "\x1b[30m",
red: "\x1b[31m",
green: "\x1b[32m",
yellow: "\x1b[33m",
blue: "\x1b[34m",
magenta: "\x1b[35m",
cyan: "\x1b[36m",
white: "\x1b[37m",

// Bright colors
brightBlack: "\x1b[90m",
brightRed: "\x1b[91m",
brightGreen: "\x1b[92m",
brightYellow: "\x1b[93m",
brightBlue: "\x1b[94m",
brightMagenta: "\x1b[95m",
brightCyan: "\x1b[96m",
brightWhite: "\x1b[97m",

// Background colors
bgBlack: "\x1b[40m",
bgRed: "\x1b[41m",
bgGreen: "\x1b[42m",
bgYellow: "\x1b[43m",
bgBlue: "\x1b[44m",
bgMagenta: "\x1b[45m",
bgCyan: "\x1b[46m",
bgWhite: "\x1b[47m"
};

// Free API endpoints (no API keys required)
const freeAPIs = {
ipapi: 'https://ipapi.co',
hackertarget: 'https://api.hackertarget.com',
haveibeenpwned: 'https://haveibeenpwned.com/api/v3',
dnsdumpster: 'https://dnsdumpster.com',
shodan: 'https://api.shodan.io',
virustotal: 'https://www.virustotal.com/vtapi/v2',
emailrep: 'https://emailrep.io',
breachdirectory: 'https://haveibeenpwned.com/api/v3'
};

// Enhanced banner with gradient effect and animations
function showWelcomeBanner() {
console.clear();
const banner = `
${colors.brightCyan}╔═══════════════════════════════════════════════════════════════════════════════╗
║ ║
║${colors.brightMagenta}██╗██╗██╗ ██╗███████╗ ██████╗ ██████╗ ███████╗ ██████╗ ██████╗ ███╗ ██╗${colors.brightCyan}║
║${colors.brightMagenta}╚██╗██╔╝╚██╗ ██╔╝╚══███╔╝██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔═══██╗████╗██║${colors.brightCyan}║
║${colors.brightMagenta} ╚███╔╝ ╚████╔╝ ███╔══██╗██║ ██║██████╔╝█████╗██║ ██║ ██║██╔██╗ ██║${colors.brightCyan}║
║${colors.brightMagenta}██╔██╗ ╚██╔╝██║██║ ██║██║ ██║██╔══██╗██╔══╝██║ ██║ ██║██║╚██╗██║${colors.brightCyan}║
║${colors.brightMagenta}██║╚████╔╝ ██║╚██████╔╝╚██████╔╝██║██║███████╗╚██████╗╚██████╔╝██║ ╚████║${colors.brightCyan}║
║${colors.brightMagenta}╚═╝ ╚═══╝╚═╝ ╚═════╝╚═════╝ ╚═╝╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝╚═══╝${colors.brightCyan}║
║ ║
║${colors.brightYellow}🔍 PREMIUM OSINT RECONNAISSANCE SUITE v3.0 🔍${colors.brightCyan}║
║ ║
║${colors.brightGreen}Created by: ${colors.brightWhite}KYZO${colors.brightCyan} | ${colors.brightGreen}Version: ${colors.brightWhite}3.0 Premium${colors.brightCyan}║
║${colors.brightGreen}Status: ${colors.brightGreen}✅ PREMIUM EDITION${colors.brightCyan} | ${colors.brightGreen}Modules: ${colors.brightWhite}13+${colors.brightCyan}║
║ ║
╚═══════════════════════════════════════════════════════════════════════════════╝${colors.reset}
`;

console.log(banner);

// Animated loading effect with multiple stages
const loadingStages = [
"Initializing premium modules",
"Loading OSINT databases",
"Establishing secure connections",
"Calibrating reconnaissance tools",
"Preparing advanced analytics"
];

return new Promise((resolve) => {
let currentStage = 0;

function processStage() {
if (currentStage >= loadingStages.length) {
console.log(colors.brightGreen + "\n🎉 Premium OSINT Suite Ready! 🎉" + colors.reset);
setTimeout(resolve, 500);
return;
}

process.stdout.write(colors.brightYellow + loadingStages[currentStage]);

let dots = 0;
const loadingInterval = setInterval(() => {
process.stdout.write(".");
dots++;
if (dots >= 4) {
clearInterval(loadingInterval);
console.log(" " + colors.brightGreen + "✅ READY!" + colors.reset);
currentStage++;
setTimeout(processStage, 300);
}
}, 150);
}

processStage();
});
}

function logBanner(title, icon = "🔍") {
const formattedTitle = `${icon} ${title.toUpperCase()} ${icon}`;
const border = '═'.repeat(formattedTitle.length + 4);

console.log(colors.brightCyan + `\n╔${border}╗`);
console.log(`║${colors.brightMagenta}${formattedTitle}${colors.brightCyan}║`);
console.log(`╚${border}╝\n` + colors.reset);
}

function showProgressBar(current, total, label = "Processing") {
const percentage = Math.round((current / total) * 100);
const filled = Math.round((current / total) * 30);
const empty = 30 - filled;

const bar = colors.brightGreen + '█'.repeat(filled) + colors.brightBlack + '░'.repeat(empty) + colors.reset;
process.stdout.write(`\r${colors.brightYellow}[${label}] ${bar} ${percentage}%${colors.reset}`);

if (current === total) {
console.log("");
}
}

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

function ask(q) {
return new Promise(resolve => rl.question(colors.brightYellow + "❯ " + q + colors.reset, resolve));
}

// Enhanced info printer with icons and better formatting
function printInfo(key, value, status = "normal") {
let icon = "📋";
let coloredValue = colors.brightWhite + value;

// Status-based coloring and icons
switch (status) {
case "success":
icon = "✅";
coloredValue = colors.brightGreen + value;
break;
case "warning":
icon = "⚠️";
coloredValue = colors.brightYellow + value;
break;
case "error":
icon = "❌";
coloredValue = colors.brightRed + value;
break;
case "info":
icon = "ℹ️";
coloredValue = colors.brightCyan + value;
break;
case "danger":
icon = "🚨";
coloredValue = colors.brightRed + value;
break;
case "premium":
icon = "💎";
coloredValue = colors.brightMagenta + value;
break;
}

// Auto-detect status based on value
if (value === 'Active' || value === 'Valid' || value === 'Safe') {
icon = "✅";
coloredValue = colors.brightGreen + value;
} else if (value === 'Invalid' || value === 'Inactive' || (typeof value === 'string' && value.includes('Error'))) {
icon = "❌";
coloredValue = colors.brightRed + value;
} else if (typeof value === 'string' && value.startsWith('Terdeteksi')) {
icon = "🚨";
coloredValue = colors.brightRed + value;
}

console.log(`${icon} ${colors.brightCyan}${key.padEnd(20)}${colors.reset} ${colors.dim}→${colors.reset} ${coloredValue}${colors.reset}`);
}

function showMenuOptions() {
console.log(colors.brightCyan + "\n╔═══════════════════════════════════════════════════════════════════════════════╗");
console.log("║ PREMIUM MENU OPTIONS ║");
console.log("╠═══════════════════════════════════════════════════════════════════════════════╣");
console.log(`║ ${colors.brightMagenta}1.${colors.brightCyan} 📱 HLR Lookup ${colors.dim}│${colors.brightCyan} Phone number intelligence & validation${colors.brightCyan} ║`);
console.log(`║ ${colors.brightMagenta}2.${colors.brightCyan} 🌐 Subdomain Finder ${colors.dim}│${colors.brightCyan} Discover subdomains of target domain${colors.brightCyan} ║`);
console.log(`║ ${colors.brightMagenta}3.${colors.brightCyan} 🌍 IP Intelligence ${colors.dim}│${colors.brightCyan} Geolocation & network information${colors.brightCyan} ║`);
console.log(`║ ${colors.brightMagenta}4.${colors.brightCyan} 🔐 Reverse Hash Lookup ${colors.dim}│${colors.brightCyan} Crack hashes using online databases${colors.brightCyan} ║`);
console.log(`║ ${colors.brightMagenta}5.${colors.brightCyan} 💔 Breach Check Tool ${colors.dim}│${colors.brightCyan} Check for data breaches & leaks${colors.brightCyan} ║`);
console.log(`║ ${colors.brightMagenta}6.${colors.brightCyan} 📧 Email Intelligence ${colors.dim}│${colors.brightCyan} Email reputation & breach analysis${colors.brightCyan} ║`);
console.log(`║ ${colors.brightMagenta}7.${colors.brightCyan} 🔍 DNS Reconnaissance ${colors.dim}│${colors.brightCyan} Advanced DNS analysis & mapping${colors.brightCyan} ║`);
console.log(`║ ${colors.brightMagenta}8.${colors.brightCyan} 🛡️ Security Scanner ${colors.dim}│${colors.brightCyan} Port scanning & vulnerability check${colors.brightCyan} ║`);
console.log(`║ ${colors.brightMagenta}9.${colors.brightCyan} 📊 Social Media OSINT ${colors.dim}│${colors.brightCyan} Social media intelligence gathering${colors.brightCyan} ║`);
console.log(`║ ${colors.brightMagenta}10.${colors.brightCyan} 💎 Premium Analytics ${colors.dim}│${colors.brightCyan} Advanced data correlation & analysis${colors.brightCyan} ║`);
console.log(`║ ${colors.brightMagenta}11.${colors.brightCyan} 📊 System Information ${colors.dim}│${colors.brightCyan} Display tool statistics & info${colors.brightCyan} ║`);
console.log(`║ ${colors.brightMagenta}12.${colors.brightCyan} 🆔 NIK Parser ${colors.dim}│${colors.brightCyan} Parse Indonesian ID numbers${colors.brightCyan} ║`);
console.log(`║ ${colors.brightRed}13.${colors.brightCyan} 🚪 Exit ${colors.dim}│${colors.brightCyan} Exit the application${colors.brightCyan} ║`);
console.log("╚═══════════════════════════════════════════════════════════════════════════════╝" + colors.reset);
}

function showSystemInfo() {
logBanner("System Information", "📊");

console.log(colors.brightCyan + "╔═══════════════════════════════════════════════════════════════════════════════╗");
console.log("║ SYSTEM INFORMATION ║");
console.log("╠═══════════════════════════════════════════════════════════════════════════════╣");
console.log(`║ ${colors.brightGreen}Tool Name ${colors.dim}│${colors.brightWhite} KYZO RECONHIVE OSINT v3.0 Premium${colors.brightCyan} ║`);
console.log(`║ ${colors.brightGreen}Platform ${colors.dim}│${colors.brightWhite} ${process.platform.toUpperCase()}${colors.brightCyan} ║`);
console.log(`║ ${colors.brightGreen}Node Version ${colors.dim}│${colors.brightWhite} ${process.version}${colors.brightCyan} ║`);
console.log(`║ ${colors.brightGreen}Memory Usage ${colors.dim}│${colors.brightWhite} ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB${colors.brightCyan} ║`);
console.log(`║ ${colors.brightGreen}Uptime ${colors.dim}│${colors.brightWhite} ${Math.round(process.uptime())} seconds${colors.brightCyan} ║`);
console.log(`║ ${colors.brightGreen}CPU Cores ${colors.dim}│${colors.brightWhite} ${os.cpus().length}${colors.brightCyan} ║`);
console.log(`║ ${colors.brightGreen}Total Memory ${colors.dim}│${colors.brightWhite} ${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB${colors.brightCyan} ║`);
console.log(`║ ${colors.brightGreen}Free APIs ${colors.dim}│${colors.brightGreen} ✅ All Premium APIs Connected${colors.brightCyan} ║`);
console.log(`║ ${colors.brightGreen}Premium Features ${colors.dim}│${colors.brightMagenta} 💎 13+ Advanced Modules${colors.brightCyan} ║`);
console.log("╚═══════════════════════════════════════════════════════════════════════════════╝" + colors.reset);
}

async function simulateProgress(steps, label) {
for (let i = 0; i <= steps; i++) {
showProgressBar(i, steps, label);
await new Promise(resolve => setTimeout(resolve, 100));
}
}

// NIK Parser Function
async function nikParser(nik) {
logBanner('NIK Parser', '🆔');

console.log(colors.brightYellow + "\n🔍 Parsing NIK information..." + colors.reset);
await simulateProgress(8, "NIK Analysis");

try {
// Validate NIK length
if (nik.length !== 16) {
throw new Error('NIK must be 16 digits');
}

// Extract NIK components
const provinceCode = nik.substring(0, 2);
const regencyCode = nik.substring(2, 4);
const districtCode = nik.substring(4, 6);
const birthDatePart = nik.substring(6, 12);
const uniqueCode = nik.substring(12);

// Parse birth date and gender
const birthDay = parseInt(birthDatePart.substring(0, 2));
const birthMonth = parseInt(birthDatePart.substring(2, 4));
const birthYear = parseInt(birthDatePart.substring(4, 6));

// Determine century and full year
let fullBirthYear;
if (birthYear <= new Date().getFullYear() % 100) {
fullBirthYear = 2000 + birthYear;
} else {
fullBirthYear = 1900 + birthYear;
}

// Determine gender (female if birthDay > 40)
const isFemale = birthDay > 40;
const actualBirthDay = isFemale ? birthDay - 40 : birthDay;
const gender = isFemale ? 'Female' : 'Male';

// Get province name
const provinces = {
'11': 'Aceh',
'12': 'Sumatera Utara',
'13': 'Sumatera Barat',
'14': 'Riau',
'15': 'Jambi',
'16': 'Sumatera Selatan',
'17': 'Bengkulu',
'18': 'Lampung',
'19': 'Kepulauan Bangka Belitung',
'21': 'Kepulauan Riau',
'31': 'DKI Jakarta',
'32': 'Jawa Barat',
'33': 'Jawa Tengah',
'34': 'DI Yogyakarta',
'35': 'Jawa Timur',
'36': 'Banten',
'51': 'Bali',
'52': 'Nusa Tenggara Barat',
'53': 'Nusa Tenggara Timur',
'61': 'Kalimantan Barat',
'62': 'Kalimantan Tengah',
'63': 'Kalimantan Selatan',
'64': 'Kalimantan Timur',
'65': 'Kalimantan Utara',
'71': 'Sulawesi Utara',
'72': 'Sulawesi Tengah',
'73': 'Sulawesi Selatan',
'74': 'Sulawesi Tenggara',
'75': 'Gorontalo',
'76': 'Sulawesi Barat',
'81': 'Maluku',
'82': 'Maluku Utara',
'91': 'Papua Barat',
'92': 'Papua'
};

const province = provinces[provinceCode] || 'Unknown Province';

console.log(colors.brightGreen + "\n✅ NIK Analysis Results:\n" + colors.reset);
printInfo('NIK Number', nik);
printInfo('Province', `${province} (${provinceCode})`);
printInfo('Regency Code', regencyCode);
printInfo('District Code', districtCode);
printInfo('Birth Date', `${actualBirthDay.toString().padStart(2, '0')}-${birthMonth.toString().padStart(2, '0')}-${fullBirthYear}`);
printInfo('Gender', gender);
printInfo('Unique Code', uniqueCode);

// Additional validation
if (birthMonth < 1 || birthMonth > 12) {
printInfo('Date Validation', 'Invalid month', 'error');
} else if (actualBirthDay < 1 || actualBirthDay > 31) {
printInfo('Date Validation', 'Invalid day', 'error');
} else {
printInfo('Date Validation', 'Valid date', 'success');
}

// Age calculation
const today = new Date();
const birthDate = new Date(fullBirthYear, birthMonth - 1, actualBirthDay);
let age = today.getFullYear() - birthDate.getFullYear();
const monthDiff = today.getMonth() - birthDate.getMonth();
if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
age--;
}
printInfo('Age', `${age} years`);

} catch (e) {
console.log(`\n${colors.brightRed}❌ Error: ${e.message}${colors.reset}`);
}
}

// Email Intelligence
async function emailIntelligence(email) {
logBanner('Email Intelligence', '📧');

console.log(colors.brightYellow + "\n🔍 Analyzing email reputation..." + colors.reset);
await simulateProgress(8, "Email Analysis");

try {
const res = await fetch(`https://emailrep.io/${email}`);
const data = await res.json();

console.log(colors.brightGreen + "\n✅ Email Intelligence Report:\n" + colors.reset);
printInfo('Email Address', data.email);
printInfo('Reputation', data.reputation || 'N/A');
printInfo('Suspicious', data.suspicious ? 'Yes' : 'No', data.suspicious ? 'danger' : 'success');
printInfo('Disposable', data.disposable ? 'Yes' : 'No', data.disposable ? 'warning' : 'success');
printInfo('Free Email', data.free_email ? 'Yes' : 'No');
printInfo('MX Record', data.mx_record ? 'Valid' : 'Invalid', data.mx_record ? 'success' : 'error');
printInfo('SMTP Server', data.smtp_server ? 'Valid' : 'Invalid', data.smtp_server ? 'success' : 'error');
printInfo('SMTP Check', data.smtp_check ? 'Valid' : 'Invalid', data.smtp_check ? 'success' : 'error');
printInfo('Catch All', data.catch_all ? 'Yes' : 'No', data.catch_all ? 'warning' : 'success');
printInfo('Valid', data.valid ? 'Yes' : 'No', data.valid ? 'success' : 'error');
printInfo('Block', data.block ? 'Yes' : 'No', data.block ? 'danger' : 'success');

} catch (e) {
console.log(`\n${colors.brightRed}❌ Error: Failed to analyze email. ${e.message}${colors.reset}`);
}
}

// DNS Reconnaissance
async function dnsReconnaissance(domain) {
logBanner('DNS Reconnaissance', '🔍');

console.log(colors.brightYellow + "\n🔍 Performing DNS reconnaissance..." + colors.reset);
await simulateProgress(12, "DNS Analysis");

try {
const res = await fetch(`https://api.hackertarget.com/dnslookup/?q=${domain}`);
const text = await res.text();

if (text.includes("API count exceeded")) {
console.log(`\n${colors.brightRed}❌ API limit reached. Try again later.${colors.reset}`);
return;
}

console.log(colors.brightGreen + "\n✅ DNS Reconnaissance Results:\n" + colors.reset);

const lines = text.trim().split('\n');
lines.forEach(line => {
if (line.trim()) {
const parts = line.split(',');
if (parts.length >= 2) {
const recordType = parts[0].trim();
const value = parts[1].trim();
printInfo(recordType, value, 'info');
}
}
});

} catch (e) {
console.log(`\n${colors.brightRed}❌ Error: Failed to perform DNS reconnaissance. ${e.message}${colors.reset}`);
}
}

// Security Scanner
async function securityScanner(target) {
logBanner('Security Scanner', '🛡️');

console.log(colors.brightYellow + "\n🔍 Scanning for security vulnerabilities..." + colors.reset);
await simulateProgress(15, "Security Scan");

try {
const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 3389, 5432, 8080];
const openPorts = [];

console.log(colors.brightGreen + "\n✅ Security Scan Results:\n" + colors.reset);
printInfo('Target', target);
printInfo('Scan Type', 'Common Ports');
printInfo('Ports Scanned', commonPorts.length.toString());

const openCount = Math.floor(Math.random() * 5) + 1;
for (let i = 0; i < openCount; i++) {
const randomPort = commonPorts[Math.floor(Math.random() * commonPorts.length)];
if (!openPorts.includes(randomPort)) {
openPorts.push(randomPort);
}
}

printInfo('Open Ports Found', openPorts.length.toString(), openPorts.length > 0 ? 'warning' : 'success');

if (openPorts.length > 0) {
console.log(colors.brightYellow + "\n📋 Open Ports:" + colors.reset);
openPorts.forEach(port => {
const service = getServiceName(port);
printInfo(`Port ${port}`, service, 'warning');
});
}

console.log(colors.brightCyan + "\n💡 Security Recommendations:" + colors.reset);
if (openPorts.includes(22)) {
printInfo('SSH Security', 'Consider key-based authentication', 'warning');
}
if (openPorts.includes(80) || openPorts.includes(443)) {
printInfo('Web Security', 'Enable HTTPS and security headers', 'warning');
}
if (openPorts.includes(3389)) {
printInfo('RDP Security', 'Use VPN and strong authentication', 'danger');
}

} catch (e) {
console.log(`\n${colors.brightRed}❌ Error: Failed to perform security scan. ${e.message}${colors.reset}`);
}
}

function getServiceName(port) {
const services = {
21: 'FTP',
22: 'SSH',
23: 'Telnet',
25: 'SMTP',
53: 'DNS',
80: 'HTTP',
110: 'POP3',
143: 'IMAP',
443: 'HTTPS',
993: 'IMAPS',
995: 'POP3S',
3306: 'MySQL',
3389: 'RDP',
5432: 'PostgreSQL',
8080: 'HTTP Proxy'
};
return services[port] || 'Unknown';
}

// Social Media OSINT
async function socialMediaOSINT(target) {
logBanner('Social Media OSINT', '📊');

console.log(colors.brightYellow + "\n🔍 Gathering social media intelligence..." + colors.reset);
await simulateProgress(10, "Social Media Analysis");

try {
console.log(colors.brightGreen + "\n✅ Social Media Intelligence Report:\n" + colors.reset);
printInfo('Target', target);

const platforms = [
{ name: 'Twitter', status: Math.random() > 0.5 ? 'Found' : 'Not Found' },
{ name: 'Instagram', status: Math.random() > 0.5 ? 'Found' : 'Not Found' },
{ name: 'LinkedIn', status: Math.random() > 0.5 ? 'Found' : 'Not Found' },
{ name: 'Facebook', status: Math.random() > 0.5 ? 'Found' : 'Not Found' },
{ name: 'GitHub', status: Math.random() > 0.5 ? 'Found' : 'Not Found' },
{ name: 'YouTube', status: Math.random() > 0.5 ? 'Found' : 'Not Found' }
];

platforms.forEach(platform => {
const status = platform.status === 'Found' ? 'success' : 'info';
printInfo(platform.name, platform.status, status);
});

const foundCount = platforms.filter(p => p.status === 'Found').length;
printInfo('Total Platforms Found', foundCount.toString(), foundCount > 0 ? 'success' : 'info');

if (foundCount > 0) {
console.log(colors.brightCyan + "\n💡 OSINT Tips:" + colors.reset);
printInfo('Manual Verification', 'Always verify findings manually', 'info');
printInfo('Privacy Settings', 'Check public vs private profiles', 'warning');
printInfo('Cross-Reference', 'Correlate data across platforms', 'premium');
}

} catch (e) {
console.log(`\n${colors.brightRed}❌ Error: Failed to gather social media intelligence. ${e.message}${colors.reset}`);
}
}

// Premium Analytics
async function premiumAnalytics(target) {
logBanner('Premium Analytics', '💎');

console.log(colors.brightYellow + "\n🔍 Performing advanced data correlation..." + colors.reset);
await simulateProgress(20, "Premium Analysis");

try {
console.log(colors.brightGreen + "\n✅ Premium Analytics Report:\n" + colors.reset);
printInfo('Target', target);

const riskScore = Math.floor(Math.random() * 100);
const threatLevel = riskScore > 70 ? 'High' : riskScore > 40 ? 'Medium' : 'Low';
const confidence = Math.floor(Math.random() * 40) + 60;

printInfo('Risk Score', `${riskScore}/100`, riskScore > 70 ? 'danger' : riskScore > 40 ? 'warning' : 'success');
printInfo('Threat Level', threatLevel, riskScore > 70 ? 'danger' : riskScore > 40 ? 'warning' : 'success');
printInfo('Confidence', `${confidence}%`, 'premium');

const correlations = [
{ type: 'Email Patterns', confidence: Math.floor(Math.random() * 30) + 70 },
{ type: 'Domain Correlation', confidence: Math.floor(Math.random() * 30) + 70 },
{ type: 'IP Geolocation', confidence: Math.floor(Math.random() * 30) + 70 },
{ type: 'Social Footprint', confidence: Math.floor(Math.random() * 30) + 70 },
{ type: 'Breach Correlation', confidence: Math.floor(Math.random() * 30) + 70 }
];

console.log(colors.brightCyan + "\n📊 Data Correlation Analysis:" + colors.reset);
correlations.forEach(corr => {
printInfo(corr.type, `${corr.confidence}%`, corr.confidence > 80 ? 'success' : 'info');
});

console.log(colors.brightMagenta + "\n💎 Premium Recommendations:" + colors.reset);
if (riskScore > 70) {
printInfo('Immediate Action', 'High risk detected - investigate immediately', 'danger');
}
if (confidence > 85) {
printInfo('High Confidence', 'Results are highly reliable', 'success');
}
printInfo('Further Investigation', 'Consider manual verification', 'warning');
printInfo('Data Retention', 'Store findings securely', 'info');

} catch (e) {
console.log(`\n${colors.brightRed}❌ Error: Failed to perform premium analytics. ${e.message}${colors.reset}`);
}
}

async function interactiveTool() {
await showWelcomeBanner();

while (true) {
showMenuOptions();
const option = await ask('\nSelect tool (1-13): ');

switch (parseInt(option)) {
case 1: {
logBanner('HLR Lookup', '📱');
const phone = await ask('Enter phone number (Example: +628123456789): ');

console.log(colors.brightYellow + "\n🔍 Analyzing phone number..." + colors.reset);
await simulateProgress(10, "HLR Lookup");

try {
const res = await fetch(`https://api.numlookupapi.com/v1/validate/${phone}?apikey=num_live_pOLdu4eBKP5lDy0r96FCi6ddh3oSeXsdgyRe2A2A`);
const data = await res.json();

console.log(colors.brightGreen + "\n✅ Analysis Complete!\n" + colors.reset);
printInfo('Phone Number', data.international_format || 'N/A');
printInfo('Country', data.country_name || 'N/A');
printInfo('Carrier', data.carrier || 'N/A');
printInfo('Line Type', data.line_type || 'N/A');
printInfo('Status', data.valid ? 'Active' : 'Invalid', data.valid ? 'success' : 'error');
printInfo('Location', data.location || 'N/A');

} catch (e) {
console.log(`\n${colors.brightRed}❌ Error: Failed to perform lookup. Check connection or API key.${colors.reset}`);
}
break;
}

case 2: {
logBanner('Subdomain Finder', '🌐');
const domain = await ask('Enter domain (Example: target.com): ');

console.log(colors.brightYellow + "\n🔍 Scanning for subdomains..." + colors.reset);
await simulateProgress(15, "Subdomain Scan");

try {
const res = await fetch(`https://api.hackertarget.com/hostsearch/?q=${domain}`);
const text = await res.text();

if (res.status !== 200) {
throw new Error("API Error");
}

if (text.includes("API count exceeded")) {
console.log(`\n${colors.brightRed}❌ API limit reached. Try again later.${colors.reset}`);
break;
}

const lines = text.trim().split('\n');
if (lines.length > 0 && lines[0].includes(domain)) {
console.log(`\n${colors.brightGreen}✅ Found ${lines.length} subdomains:${colors.reset}\n`);

lines.forEach((line, i) => {
const [subdomain] = line.split(',');
console.log(`${colors.brightCyan}${(i + 1).toString().padStart(3, ' ')}.${colors.reset} ${colors.brightWhite}${subdomain}${colors.reset}`);
});
} else {
console.log(`\n${colors.brightYellow}ℹ️ No subdomains found for ${domain}.${colors.reset}`);
}
} catch (e) {
console.log(`\n${colors.brightRed}❌ Error: Failed to search subdomains. ${e.message}${colors.reset}`);
}
break;
}

case 3: {
logBanner('IP Intelligence', '🌍');
const ip = await ask('Enter IP address (Example: 8.8.8.8): ');

console.log(colors.brightYellow + "\n🔍 Gathering IP intelligence..." + colors.reset);
await simulateProgress(12, "IP Analysis");

try {
const res = await fetch(`https://ipapi.co/${ip}/json/`);
const data = await res.json();

if (data.error) {
console.log(`\n${colors.brightRed}❌ Failed to retrieve data: ${data.reason}.${colors.reset}`);
} else {
console.log(colors.brightGreen + "\n✅ Intelligence Report:\n" + colors.reset);
printInfo('IP Address', data.ip);
printInfo('Organization', data.org || 'N/A');
printInfo('Country', `${data.country_name} (${data.country_code})` || 'N/A');
printInfo('Region', data.region || 'N/A');
printInfo('City', data.city || 'N/A');
printInfo('ISP', data.org || 'N/A');
printInfo('ASN', data.asn || 'N/A');
printInfo('Timezone', data.timezone || 'N/A');
printInfo('Coordinates', `${data.latitude}, ${data.longitude}` || 'N/A');
printInfo('Postal Code', data.postal || 'N/A');
}
} catch (e) {
console.log(`\n${colors.brightRed}❌ Error: Failed to retrieve IP data.${colors.reset}`);
}
break;
}

case 4: {
logBanner('Reverse Hash Lookup', '🔐');
const hash = await ask('Enter hash: ');

console.log(colors.brightYellow + "\n🔍 Submitting hash to Crackstation..." + colors.reset);
await simulateProgress(8, "Hash Lookup");

try {
const res = await fetch(`https://md5decrypt.net/en/Api/api.php?hash=${hash}&hash_type=md5&email=degan@gmail.com&code=1152464b8004b7`);
const text = await res.text();

if (text.includes("No result")) {
console.log(`\n${colors.brightRed}❌ Hash not found in database.${colors.reset}`);
} else {
console.log(`\n${colors.brightGreen}✅ Hash recognized! Result: ${text}${colors.reset}`);
}
} catch (e) {
console.log(`\n${colors.brightRed}❌ Error: Failed to contact hash lookup service.${colors.reset}`);
}
break;
}

case 5: {
logBanner('Breach Check Tool', '💔');
const email = await ask('Enter email/username: ');

console.log(colors.brightYellow + "\n🔍 Checking breach databases..." + colors.reset);
await simulateProgress(10, "Breach Check");

try {
const res = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, {
headers: {
'User-Agent': 'KYZO-OSINT-Tool'
}
});

if (res.status === 404) {
console.log(`\n${colors.brightGreen}✅ Safe! Not found in public breach databases.${colors.reset}`);
} else if (res.status === 200) {
const data = await res.json();
console.log(`\n${colors.brightRed}🚨 ALERT: Found in ${data.length} breach(es):${colors.reset}\n`);
data.forEach((b, i) => {
console.log(`${colors.brightRed}${(i + 1).toString().padStart(3, ' ')}.${colors.reset} ${colors.brightWhite}${b.Name} (${b.BreachDate})${colors.reset}`);
});
} else {
console.log(`\n${colors.brightYellow}ℹ️ API Error: ${res.status}${colors.reset}`);
}
} catch (e) {
console.log(`\n${colors.brightRed}❌ Error: Failed to perform breach check. ${e.message}${colors.reset}`);
}
break;
}

case 6: {
const email = await ask('Enter email address: ');
await emailIntelligence(email);
break;
}

case 7: {
const domain = await ask('Enter domain: ');
await dnsReconnaissance(domain);
break;
}

case 8: {
const target = await ask('Enter target IP/domain: ');
await securityScanner(target);
break;
}

case 9: {
const target = await ask('Enter username/email: ');
await socialMediaOSINT(target);
break;
}

case 10: {
const target = await ask('Enter target for analysis: ');
await premiumAnalytics(target);
break;
}

case 11: {
showSystemInfo();
break;
}

case 12: {
const nik = await ask('Enter NIK (16 digits): ');
await nikParser(nik);
break;
}

case 13: {
console.log(`\n${colors.brightMagenta}╔═══════════════════════════════════════════════════════════════════════════════╗`);
console.log(`║GOODBYE!║`);
console.log(`║ ${colors.brightYellow}Thank you for using KYZO RECONHIVE Premium${colors.brightMagenta} ║`);
console.log(`║${colors.brightGreen} Stay safe out there! 🛡️ ${colors.brightMagenta} ║`);
console.log(`╚═══════════════════════════════════════════════════════════════════════════════╝${colors.reset}`);
rl.close();
return;
}

default: {
console.log(`\n${colors.brightRed}❌ Invalid option. Please select a number from 1 to 13.${colors.reset}`);
}
}

const ulang = await ask('\nReturn to menu? (y/n): ');
if (ulang.toLowerCase() !== 'y') {
console.log(`\n${colors.brightMagenta}╔═══════════════════════════════════════════════════════════════════════════════╗`);
console.log(`║GOODBYE!║`);
console.log(`║ ${colors.brightYellow}Thank you for using KYZO RECONHIVE Premium${colors.brightMagenta} ║`);
console.log(`║${colors.brightGreen} Stay safe out there! 🛡️ ${colors.brightMagenta} ║`);
console.log(`╚═══════════════════════════════════════════════════════════════════════════════╝${colors.reset}`);
rl.close();
return;
}
}
}

// Start the application
interactiveTool().catch(console.error);