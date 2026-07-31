# DynamoDB production backups

This independent CloudFormation stack exports every AoS Reminders production DynamoDB table to
S3 each night at 09:00 UTC. It is deliberately outside every application service stack, so an app
rollback or `serverless remove` cannot delete the backup schedule or bucket.

The bucket has versioning, public-access blocking, AES-256 server-side encryption, and S3 Object
Lock in governance mode for 35 days. Current exports expire after 45 days; once an object becomes
noncurrent, lifecycle cleanup removes it after its retention has elapsed. CloudFormation retains
the bucket if this stack is deleted.

## Deploy

From the repository root:

```powershell
aws cloudformation validate-template `
  --region us-east-1 `
  --template-body file://infra/dynamodb-backups/template.yaml

aws cloudformation deploy `
  --region us-east-1 `
  --stack-name aos-reminders-dynamodb-backups `
  --template-file infra/dynamodb-backups/template.yaml `
  --capabilities CAPABILITY_IAM `
  --no-fail-on-empty-changeset
```

The default bucket name is `aos-reminders-dynamodb-backups`. Override `BackupBucketName` during
the first deployment only if that globally unique name is unavailable. Object Lock cannot be
disabled after bucket creation.

## Verify exports

Invoke the function once after deployment instead of waiting for the nightly rule:

```powershell
aws lambda invoke `
  --region us-east-1 `
  --function-name aos-reminders-dynamodb-backup-export `
  --cli-binary-format raw-in-base64-out `
  .cache/aos4/dynamodb-backup-invocation.json

aws dynamodb list-exports `
  --region us-east-1 `
  --query 'ExportSummaries[].{Arn:ExportArn,Status:ExportStatus}'
```

Each table prefix contains an `AWSDynamoDB` export directory. Inspect a data object's retention
metadata with `aws s3api head-object --bucket aos-reminders-dynamodb-backups --key <key>` and
confirm `ObjectLockMode` is `GOVERNANCE` with an `ObjectLockRetainUntilDate` at least 35 days after
creation.

## Prove a restore

DynamoDB import creates a new table; it never overwrites the source table. Use the data directory
for one completed export, not the export's parent prefix:

```powershell
aws dynamodb import-table `
  --region us-east-1 `
  --s3-bucket-source S3Bucket=aos-reminders-dynamodb-backups,S3KeyPrefix=<table>/<date>/AWSDynamoDB/<export-id>/data/ `
  --input-format DYNAMODB_JSON `
  --input-compression-type GZIP `
  --table-creation-parameters file://<throwaway-table-parameters.json>
```

Wait for the import to complete, compare the throwaway table's `ItemCount` with the export's
`ItemCount`, then delete only the explicitly named throwaway table. The retained S3 export remains
the recovery source.
