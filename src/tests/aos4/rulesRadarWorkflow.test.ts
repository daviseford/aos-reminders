import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const rootPath = process.cwd()
const workflowPath = path.join(rootPath, '.github', 'workflows', 'aos4-rules-radar.yml')
const runbookPath = path.join(rootPath, 'docs', 'data', 'aos4-maintenance.md')

describe('AoS 4 Rules Radar workflow contract', () => {
  it('uses distinct nonzero daily and weekly schedules plus bounded manual controls', () => {
    const workflow = fs.readFileSync(workflowPath, 'utf8')
    const crons = Array.from(workflow.matchAll(/cron:\s*['"](\d+)\s+[^'"]+['"]/g), match => Number(match[1]))

    expect(crons).toHaveLength(2)
    expect(crons.every(minute => minute > 0)).toBe(true)
    expect(new Set(crons).size).toBe(2)
    expect(workflow).toContain('workflow_dispatch:')
    expect(workflow).toContain('source:')
    expect(workflow).toContain('report_only:')
    expect(workflow).toContain('cancel-in-progress: false')
  })

  it('grants only read-content and write-issue permissions', () => {
    const workflow = fs.readFileSync(workflowPath, 'utf8')

    expect(workflow).toMatch(/permissions:\s*\n\s+contents: read\s*\n\s+issues: write/)
    expect(workflow).not.toMatch(/pull-requests:\s*write/)
  })

  it('gates full community observation and candidate acquisition on material sentinels', () => {
    const workflow = fs.readFileSync(workflowPath, 'utf8')

    expect(workflow).toContain('data:aos4:radar:observe')
    expect(workflow).toContain('data:aos4:radar:observe-bsdata')
    expect(workflow).toContain('data:aos4:inventory:observe-wahapedia')
    expect(workflow).toMatch(/name: Expand Wahapedia observation[\s\S]+if:.*wahapedia_material/)
    expect(workflow).toMatch(/name: Prepare candidate evidence[\s\S]+if:.*candidate_material/)
  })

  it('always notifies and uploads curated evidence before preserving upstream failure', () => {
    const workflow = fs.readFileSync(workflowPath, 'utf8')

    expect(workflow).toMatch(/name: Synchronize Rules Radar issue[\s\S]{0,80}if: always\(\)/)
    expect(workflow).toContain('GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}')
    expect(workflow).toMatch(/name: Upload Rules Radar evidence[\s\S]{0,80}if: always\(\)/)
    expect(workflow).toContain('material-event-count.txt')
    expect(workflow).toContain('candidate-evidence.json')
    expect(workflow).not.toContain('.cache/aos4/radar/artifacts')
    expect(workflow).not.toContain('.cache/aos4/review/discovery-artifacts')
    expect(workflow).toMatch(/name: Preserve Rules Radar failure[\s\S]{0,80}if: always\(\)/)
  })

  it('documents dry runs, baseline review, issue recovery, and default-branch activation', () => {
    const runbook = fs.readFileSync(runbookPath, 'utf8')

    expect(runbook).toContain('Rules Radar')
    expect(runbook).toContain('--report-only')
    expect(runbook).toContain('baselineSha')
    expect(runbook).toContain('malformed machine state')
    expect(runbook).toContain('default branch')
    expect(runbook).toContain('never accepts')
  })
})
