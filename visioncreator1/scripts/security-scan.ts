import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function runSecurityScan() {
  try {
    // Run Snyk to check for vulnerabilities
    const { stdout, stderr } = await execAsync('npx snyk test')
    
    console.log('Snyk test results:')
    console.log(stdout)

    if (stderr) {
      console.error('Snyk test errors:')
      console.error(stderr)
    }

    // Run npm audit
    const { stdout: auditStdout, stderr: auditStderr } = await execAsync('npm audit --json')
    
    const auditResult = JSON.parse(auditStdout)
    
    console.log('npm audit results:')
    console.log(`Total vulnerabilities: ${auditResult.metadata.vulnerabilities.total}`)
    console.log(`Critical: ${auditResult.metadata.vulnerabilities.critical}`)
    console.log(`High: ${auditResult.metadata.vulnerabilities.high}`)
    console.log(`Moderate: ${auditResult.metadata.vulnerabilities.moderate}`)
    console.log(`Low: ${auditResult.metadata.vulnerabilities.low}`)

    if (auditStderr) {
      console.error('npm audit errors:')
      console.error(auditStderr)
    }

    // Check if there are any high or critical vulnerabilities
    if (
      auditResult.metadata.vulnerabilities.high > 0 ||
      auditResult.metadata.vulnerabilities.critical > 0
    ) {
      throw new Error('Security scan failed: High or Critical vulnerabilities found')
    }

    console.log('Security scan passed!')
  } catch (error) {
    console.error('Security scan failed:', error)
    process.exit(1)
  }
}

runSecurityScan()

