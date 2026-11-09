// The reporter plugin ships without TypeScript declarations.
declare module 'cypress-mochawesome-reporter/plugin' {
  const mochawesomePlugin: (on: Cypress.PluginEvents) => void;
  export default mochawesomePlugin;
}
