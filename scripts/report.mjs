/**
 * Runs the Cypress suite and opens the generated HTML report,
 * even when some tests fail (that is when the report is most useful).
 *
 * Usage: npm run report [-- <extra cypress run args>]
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const reportPath = resolve('cypress/reports/index.html');
const extraArgs = process.argv.slice(2);

const run = spawnSync('npx', ['cypress', 'run', ...extraArgs], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (!existsSync(reportPath)) {
  console.error(`Report not found at ${reportPath}`);
  process.exit(run.status ?? 1);
}

const openers = { darwin: ['open'], win32: ['cmd', '/c', 'start', '""'] };
const [command, ...args] = openers[process.platform] ?? ['xdg-open'];
spawnSync(command, [...args, reportPath], { stdio: 'ignore' });

console.log(`Report: ${reportPath}`);
process.exit(run.status ?? 1);
