
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

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

async function run() {
    const localPath = path.join(process.cwd(), 'data', 'users.json');
    const backupPath = path.join(process.cwd(), 'data', 'users.json.r2-backup.json');

    const localUsers = JSON.parse(fs.readFileSync(localPath, 'utf8'));
    let backupUsers = [];
    
    try {
        backupUsers = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    } catch (e) {
        console.log("Backup file not found or invalid.");
        return;
    }

    // Find Victor in backup
    const victor = backupUsers.find(u => u.email === 'victorhugolafeta@gmail.com');
    
    if (!victor) {
        console.log("Victor not found in backup.");
        return;
    }

    console.log("Found Victor in backup. Restoring and updating password...");

    // Check if Victor is already in local (by email)
    const existingVictorIndex = localUsers.findIndex(u => u.email === 'victorhugolafeta@gmail.com');

    if (existingVictorIndex !== -1) {
        console.log("Victor already exists locally. Updating password.");
        localUsers[existingVictorIndex].password = '22mNf4vgRy6';
        localUsers[existingVictorIndex].status = 'active'; // Ensure active
    } else {
        console.log("Adding Victor to local users.");
        victor.password = '22mNf4vgRy6';
        victor.status = 'active'; // Ensure active
        localUsers.push(victor);
    }

    // Save locally
    fs.writeFileSync(localPath, JSON.stringify(localUsers, null, 2));
    console.log("Local users.json updated.");

    // Push to R2
    console.log("Pushing updated users.json to R2...");
    try {
        const putCmd = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: 'data/users.json',
            Body: Buffer.from(JSON.stringify(localUsers, null, 2)),
            ContentType: 'application/json'
        });
        await R2.send(putCmd);
        console.log("R2 updated successfully!");
    } catch (e) {
        console.error("Failed to update R2:", e);
    }
}

run();
