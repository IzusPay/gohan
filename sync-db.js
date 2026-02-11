
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const path = require('path');

// Load .env.local manually
try {
  const envPath = path.join(process.cwd(), '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
} catch (e) {
  console.log('Could not read .env.local');
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
});

async function syncFile(filename) {
  const localPath = path.join(process.cwd(), 'data', filename);
  const key = `data/${filename}`;
  
  if (!fs.existsSync(localPath)) {
      console.log(`Skipping ${filename} (not found locally)`);
      return;
  }

  console.log(`Syncing ${filename}...`);

  // 1. Backup remote
  try {
    const getCmd = new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key });
    const response = await R2.send(getCmd);
    const remoteContent = await response.Body.transformToString();
    fs.writeFileSync(path.join(process.cwd(), 'data', `${filename}.r2-backup.json`), remoteContent);
    console.log(` - Backup created: data/${filename}.r2-backup.json`);
  } catch (e) {
    console.log(` - No existing remote file to backup (or error): ${e.message}`);
  }

  // 2. Upload local
  try {
    const content = fs.readFileSync(localPath, 'utf8');
    const putCmd = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(content),
      ContentType: 'application/json'
    });
    await R2.send(putCmd);
    console.log(` - Upload successful!`);
  } catch (e) {
    console.error(` - Upload failed: ${e.message}`);
  }
}

async function run() {
    await syncFile('users.json');
    await syncFile('vps_orders.json');
}

run();
