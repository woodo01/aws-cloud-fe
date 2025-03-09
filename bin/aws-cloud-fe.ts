#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NodejsAwsShopReactStack } from '../lib/nodejs-aws-shop-react-stack';

const app = new cdk.App();
new NodejsAwsShopReactStack(app, 'NodejsAwsShopReactStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});