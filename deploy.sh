#!/bin/sh
rm -rf ./build

yarn build

cp -f ./package.json ./yarn.lock ./build

cd build

yarn install --production

zip -r ./lambda.zip ./

aws lambda update-function-code \
    --function-name effort-accuracy \
    --profile private\
    --zip-file fileb://lambda.zip
