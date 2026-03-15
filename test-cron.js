const fs = require('fs');
const https = require('https');

try {
  const projectData = JSON.parse(fs.readFileSync('.vercel/project.json', 'utf8'));
  const envVars = projectData.env || [];
  const cronSecretVar = envVars.find(e => e.key === 'CRON_SECRET');
  if (!cronSecretVar) throw new Error('CRON_SECRET not found in .vercel/project.json');

  const token = cronSecretVar.value;
  console.log('Got token. Fetching...');

  const req = https.request('https://dreammakersstudio24.vercel.app/api/cron/generate', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    timeout: 70000 // 70 seconds
  }, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log(`BODY: ${body}`);
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
    process.exit(1);
  });

  req.on('timeout', () => {
    console.error('Request timed out!');
    req.destroy();
    process.exit(1);
  });

  req.end();
} catch (e) {
  console.error("Setup error:", e);
  process.exit(1);
}
