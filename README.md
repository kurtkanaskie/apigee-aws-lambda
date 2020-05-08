# Apigee to AWS Lambda
Simple API proxy to demonstrate access to AWS Lambda. Uses AWS SDK with Node.JS.

**NOTE:** Node.JS proxies are no longer supported by Apigee.

Last tested November 2018, use as POC.

## Deployment
Using Apigeetool

```
apigeetool deploy -N $ORG -e $ENV -n pingstatus-v1-lambda -d .

apigeetool createKVMMap -N -o $ORG -e $ENV --mapName pingstatus-v1-lambda
apigeetool addEntryToKVM -N -o $ORG -e $ENV --mapName pingstatus-v1-lambda --entryName lambda --entryValue PROJECT_NAME
apigeetool addEntryToKVM -N -o $ORG -e $ENV --mapName pingstatus-v1-lambda --entryName accessKeyId --entryValue SOME_VALUE
apigeetool addEntryToKVM -N -o $ORG -e $ENV --mapName pingstatus-v1-lambda --entryName secretAccessKey --entryValue SOME_VALUE
apigeetool addEntryToKVM -N -o $ORG -e $ENV --mapName pingstatus-v1-lambda --entryName region --entryValue SOME_VALUE
```

## Disclaimer

This example is not an official Google product, nor is it part of an official Google product.

## License

[NOTICE](NOTICE) this material is copyright 2020, Google LLC. and [LICENSE](LICENSE) is under the Apache 2.0 license. This code is open source.
