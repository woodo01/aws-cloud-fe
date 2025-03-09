import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';

export class NodejsAwsShopReactStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket for the website
    const websiteBucket = new s3.Bucket(this, 'my-first-aws-app-mk1', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    // Create a CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'MyWebDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    });

    // Deploy site contents to S3
    new s3deploy.BucketDeployment(this, 'my-first-aws-app-mk', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../dist'))],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*']
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName
    });
  }
}
