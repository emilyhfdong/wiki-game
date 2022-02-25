import type { AWS } from "@serverless/typescript"
import { functions } from "./src/functions"

const serverlessConfiguration: AWS = {
  service: { name: "wiki-game" },
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      BUCKET_NAME: "${self:service.name}-data",
      ARTICLES_DATA_KEY: "articles.json",
      CONNECTIONS_TABLE_NAME: "${self:service.name}-connections",
      GROUPS_TABLE_NAME: "${self:service.name}-groups",
      WS_ENDPOINT: {
        "Fn::Join": [
          "",
          [
            { Ref: "WebsocketsApi" },
            ".execute-api.",
            { Ref: "AWS::Region" },
            ".amazonaws.com/",
            "dev",
          ],
        ],
      },
    },
    lambdaHashingVersion: "20201221",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: [
          { "Fn::GetAtt": ["DataBucket", "Arn"] },
          { "Fn::Join": ["/", [{ "Fn::GetAtt": ["DataBucket", "Arn"] }, "*"]] },
        ],
      },
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:PutItem",
        ],
        Resource: [{ "Fn::GetAtt": ["ConnectionsTable", "Arn"] }],
      },
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:PutItem",
        ],
        Resource: [{ "Fn::GetAtt": ["GroupsTable", "Arn"] }],
      },
    ],
  },

  functions: { ...functions },
  resources: {
    Resources: {
      DataBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:provider.environment.BUCKET_NAME}",
          AccessControl: "PublicRead",
        },
      },
      ConnectionsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.CONNECTIONS_TABLE_NAME}",
          AttributeDefinitions: [
            { AttributeName: "connectionId", AttributeType: "S" },
          ],
          KeySchema: [{ AttributeName: "connectionId", KeyType: "HASH" }],
          SSESpecification: { SSEEnabled: true },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
      GroupsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:provider.environment.GROUPS_TABLE_NAME}",
          AttributeDefinitions: [
            { AttributeName: "groupId", AttributeType: "S" },
          ],
          KeySchema: [{ AttributeName: "groupId", KeyType: "HASH" }],
          SSESpecification: { SSEEnabled: true },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
}
module.exports = serverlessConfiguration
