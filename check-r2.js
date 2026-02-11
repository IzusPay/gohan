
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
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

console.log('Config:', {
  R2_ACCOUNT_ID,
  R2_BUCKET_NAME,
  AccessKeyLength: R2_ACCESS_KEY_ID ? R2_ACCESS_KEY_ID.length : 0
});

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
});

async function checkR2() {
  console.log('Checking R2 connection...');
  
  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: 'data/',
      Delimiter: '/',
    });
    
    const data = await R2.send(command);
    console.log('Success! Files in bucket:');
    
    if (data.Contents) {
        data.Contents.forEach(file => console.log(` - ${file.Key} (${file.Size} bytes)`));
        
        // Check if users.json exists
        const userFile = data.Contents.find(f => f.Key === 'data/users.json');
        if (userFile) {
            console.log('\nusers.json found! Downloading content...');
            const getCmd = new GetObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: 'data/users.json'
            });
            const response = await R2.send(getCmd);
            const str = await response.Body.transformToString();
            console.log('Content:', str);
        } else {
            console.log('\nWARNING: users.json NOT found in R2!');
        }
    } else {
        console.log('No files found.');
    }

  } catch (error) {
    console.error('Error connecting to R2:', error);
  }
}

checkR2();
