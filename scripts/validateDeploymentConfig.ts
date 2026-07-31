import { deploymentEndpointsFromEnvironment, inspectDeploymentArtifact } from './deploymentConfig'

const run = () => {
  const mode = process.argv[2]
  const endpoints = deploymentEndpointsFromEnvironment()

  if (mode === 'config') {
    console.log('Production API endpoint configuration is valid.')
    return
  }
  if (mode === 'artifact') {
    const result = inspectDeploymentArtifact(process.argv[3] || 'dist', endpoints)
    console.log(`Inspected ${result.filesInspected} build artifact files.`)
    return
  }
  throw new Error('Usage: validateDeploymentConfig.ts <config|artifact> [artifact-directory]')
}

try {
  run()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
