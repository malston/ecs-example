# ECS Example App

Node.js service that writes "Hello World!" to the bound ECS bucket and then reads back it's contents every 10 seconds.

## CF Usage 

Assuming you have a deployed ECS service broker, create a new service called `my_bucket` and cf push this app from this directory.

```shell
cf create-service ecs-bucket 5gb my_bucket
cf push
```

## Running Locally

Copy the vcap-sample.json to vcap.json and edit it appropriately to an ECS bucket you have access to.

```shell
npm install
node app.js
```
