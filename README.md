# ECS Example App

Node.js service that writes "Hello World!" to the bound ECS bucket and then reads back it's contents every 10 seconds.

## CF Usage

Assuming you have a deployed ECS service broker, create a new service called `my_bucket` and cf push this app from this directory.

```shell
cf create-service ecs-bucket 5gb my_bucket
cf push ecs-example -f manifest.yml --no-start
cf bind-service ecs-example my_bucket
cf restart ecs-example
```

You should see messages in the logs like the following:

```shell
$ cf logs ecs-example
Retrieving logs for app ecs-example in org cloudfoundry / space test-app as admin...

   2022-02-15T10:44:17.49-0700 [APP/PROC/WEB/0] OUT Successfully created sample.txt
   2022-02-15T10:44:17.50-0700 [APP/PROC/WEB/0] OUT Hello World!
   2022-02-15T10:44:27.52-0700 [APP/PROC/WEB/0] OUT Successfully created sample.txt
   2022-02-15T10:44:27.53-0700 [APP/PROC/WEB/0] OUT Hello World!
   2022-02-15T10:44:37.55-0700 [APP/PROC/WEB/0] OUT Successfully created sample.txt
   2022-02-15T10:44:37.56-0700 [APP/PROC/WEB/0] OUT Hello World!
```

To push the read-only version of the app so that the app only reads from the bucket.

```shell
cf push -f manifest-readonly.yml --no-start
cf bind-service ecs-example my_bucket
cf restart ecs-example
```

This will read from the same bucket created above.

## Running Locally

Copy the `vcap-sample.json` to `vcap.json` and edit it appropriately to an ECS bucket you have access to.

```shell
npm install
node app.js
```
