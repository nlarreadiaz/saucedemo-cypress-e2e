import { register as registerCypressGrep } from '@cypress/grep';
import 'cypress-mochawesome-reporter/register';

registerCypressGrep();

beforeEach(() => {
  // SauceDemo sends error telemetry to a third-party service (Backtrace).
  // Stubbing it keeps tests isolated from external network noise.
  cy.intercept({ hostname: /backtrace\.io$/ }, { statusCode: 204 });
});
