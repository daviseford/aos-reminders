import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const template = readFileSync(resolve('infra/dynamodb-backups/template.yaml'), 'utf8')

const productionTables = [
  'aos-reminders-subscription-api-v2-prod',
  'aos-reminders-subscription-api-v2-provider-events-prod',
  'aos-reminders-rest-api-prod',
  'aos-reminders-link-api-prod',
  'aos-reminders-coupon-api-prod',
  'aos-reminders-admin-audit',
] as const

describe('DynamoDB backup infrastructure', () => {
  it('retains immutable export objects outside DynamoDB', () => {
    expect(template).toMatch(/DeletionPolicy: Retain/)
    expect(template).toMatch(/ObjectLockEnabled: true/)
    expect(template).toMatch(/Mode: GOVERNANCE\s+Days: 35/)
    expect(template).toMatch(/VersioningConfiguration:\s+Status: Enabled/)
    expect(template).toMatch(/BlockPublicAcls: true/)
    expect(template).toMatch(/BlockPublicPolicy: true/)
    expect(template).toMatch(/IgnorePublicAcls: true/)
    expect(template).toMatch(/RestrictPublicBuckets: true/)
    expect(template).toMatch(/ExpirationInDays: 45/)
    expect(template).toMatch(/NoncurrentDays: 1/)
  })

  it('exports every production table from a dedicated scheduled role', () => {
    for (const tableName of productionTables) expect(template).toContain(tableName)
    expect(template).toMatch(/Runtime: nodejs22\.x/)
    expect(template).toMatch(/dynamodb:ExportTableToPointInTime/)
    expect(template).toMatch(/ScheduleExpression: cron\(0 9 \* \* \? \*\)/)
    expect(template).toMatch(/S3Prefix: `\$\{tableName\}\/\$\{exportDate\}`/)
    expect(template).toMatch(/ExportFormat: 'DYNAMODB_JSON'/)
    expect(template).toMatch(/ExportType: 'FULL_EXPORT'/)
  })
})
