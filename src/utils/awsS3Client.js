// src/utils/awsS3Client.js
import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

const REGION = "ap-south-1"; // replace with your region
const IDENTITY_POOL_ID =  "ap-south-1:621fa8b4-5230-4669-8127-cc8a19b50b03"; // replace with yours
export const BUCKET_NAME = "angadi-recommendations";

export const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    identityPoolId: IDENTITY_POOL_ID,
    clientConfig: { region: REGION }
  })
});
