
require('dotenv').config({ path: '.env.local' });
const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    console.error("Missing environment variables");
    process.exit(1);
}

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const corsRules = [
  {
    AllowedHeaders: ["*"],
    AllowedMethods: ["PUT", "POST", "GET", "DELETE", "HEAD"],
    AllowedOrigins: ["*"], 
    ExposeHeaders: ["ETag"],
    MaxAgeSeconds: 3000,
  },
];

const run = async () => {
  try {
    console.log(`Configuring CORS for bucket: ${R2_BUCKET_NAME}...`);
    const command = new PutBucketCorsCommand({
      Bucket: R2_BUCKET_NAME,
      CORSConfiguration: {
        CORSRules: corsRules,
      },
    });
    await R2.send(command);
    console.log("CORS configured successfully");
  } catch (err) {
    console.error("Error configuring CORS:", err);
  }
};

run();
