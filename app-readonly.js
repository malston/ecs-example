// This is a service that pulls write "Hello Mark!" to the bound ECS bucket and then reads back it's contents.
// It runs continuously every 10 seconds.

import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import cfenv from 'cfenv/lib/cfenv.js';
import { readFile } from 'fs/promises';

let localVCAP
try {
	localVCAP = JSON.parse(await readFile("./vcap.json", "utf8"));
} catch (err) {
	console.log("Could not find vcap.json, skipping")
}

var appEnv = cfenv.getAppEnv({vcap: localVCAP}) // vcap specification is ignored if not running locally
var creds  = appEnv.getServiceCreds('my_bucket') || {}
console.log(creds);

// Trying vcap instead of below to get credentials
const s3Client = new S3Client({
	forcePathStyle: true,
	bucketEndpoint: false,
	endpoint: creds.s3Url,
	region: 'us-east-1',
	credentials: {
		accessKeyId: creds.accessKey,
		secretAccessKey: creds.secretKey}
	});
console.log("s3client created...")


const run = async () => {
	const streamToString = (stream) =>
	new Promise((resolve, reject) => {
		const chunks = [];
		stream.on("data", (chunk) => chunks.push(chunk));
		stream.on("error", reject);
		stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
	});

	try {
		const getResults = await s3Client.send(new GetObjectCommand({
			Bucket: creds.bucket,
			Key: 'sample.txt'
		}));
		const bodyContents = await streamToString(getResults.Body);
		console.log('bucket content: ' + bodyContents);
	} catch (err) {
		console.log("Error", err);
	}

	//restart the whole cycle again from the top after wait time
	setTimeout(function() {
		run();
	}, 10 * 1000);
}
run();
