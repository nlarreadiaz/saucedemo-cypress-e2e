import { defineConfig } from 'cypress';
import { plugin as cypressGrepPlugin } from '@cypress/grep/plugin';
import mochawesomePlugin from 'cypress-mochawesome-reporter/plugin';

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'SauceDemo E2E Report',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },

  // Values exposed to the browser via Cypress.expose().
  // By default, quarantined known-defect tests are excluded from the run.
  // Any `--expose grepTags=...` passed on the CLI overrides this default.
  expose: {
    grepTags: '-@known-defect',
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },

  viewportWidth: 1280,
  viewportHeight: 800,
  defaultCommandTimeout: 8000,

  retries: {
    runMode: 2,
    openMode: 0,
  },

  screenshotOnRunFailure: true,
  // Video is only recorded in CI to keep local runs fast.
  video: Boolean(process.env.CI),

  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      mochawesomePlugin(on);
      cypressGrepPlugin(config);
      return config;
    },
  },
});
