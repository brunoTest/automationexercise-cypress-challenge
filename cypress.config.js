// cypress.config.js
const { defineConfig } = require('cypress');
const fs = require('node:fs'); // Node.js 'fs' module for file system operations (modern import)
const path = require('node:path'); // Node.js 'path' module for path manipulation (modern import)

module.exports = defineConfig({
  // --- INICIO DE LA CONFIGURACIÓN DE MOCHAWESOME ---
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports', // Directorio donde se guardarán los reportes
    charts: true,                 // Muestra gráficos en el reporte
    reportPageTitle: 'Reporte de Pruebas E2E - Automation Exercise', // Título de la página HTML del reporte
    embeddedScreenshots: true,    // Incrusta las capturas de pantalla en el reporte HTML (para fallos)
    inlineAssets: true,           // Incrusta todos los assets (CSS, JS) en el HTML para que sea un solo archivo portable
    overwrite: false,             // Si es true, sobrescribe el reporte anterior. Si es false, crea uno nuevo con timestamp.
    html: true,                   // Generar reporte HTML
    json: true                    // Generar reporte JSON (puede ser útil para integraciones o merging)
  },
  // --- FIN DE LA CONFIGURACIÓN DE MOCHAWESOME ---

  e2e: {
    baseUrl: 'https://www.automationexercise.com',

    setupNodeEvents(on, config) {
      // --- Task Registration ---
      // Register tasks that can be called from tests using `cy.task()`.
      // This task clears the downloads folder before each test run.
      on('task', {
        /**
         * @task clearDownloads
         * @description Clears the Cypress downloads folder by removing and recreating it.
         *              This ensures a clean state for tests involving file downloads.
         * @returns {null} - Cypress tasks should return a value or null/Promise.
         * @throws {Error} If an error occurs during folder deletion or creation.
         */
        clearDownloads() {
          const downloadsFolder = config.downloadsFolder; // Get the configured downloads folder path
          console.log(`TASK: Attempting to clear downloads folder: ${downloadsFolder}`);

          if (fs.existsSync(downloadsFolder)) {
            try {
              fs.rmSync(downloadsFolder, { recursive: true, force: true }); // Remove the folder and its contents
              fs.mkdirSync(downloadsFolder, { recursive: true }); // Recreate the empty folder
              console.log(`TASK: Successfully cleared and recreated downloads folder: ${downloadsFolder}`);
            } catch (err) {
              console.error(`TASK ERROR: Error clearing downloads folder: ${downloadsFolder}`, err);
              // Propagate the error so Cypress knows the task failed.
              throw new Error(`Failed to clear downloads folder: ${err.message}`);
            }
          } else {
            // If the folder doesn't exist, create it to prevent errors in tests expecting it.
            console.log(`TASK: Downloads folder not found, creating: ${downloadsFolder}`);
            fs.mkdirSync(downloadsFolder, { recursive: true });
          }
          return null; // Tasks must return something (or a Promise that resolves).
        }
        // You can register other tasks here:
        // myOtherTask(arg) { /* ... */ return someResult; }
      });
      // --- End of Task Registration ---

      // --- REGISTRAR PLUGIN DE MOCHAWESOME REPORTER ---
      require('cypress-mochawesome-reporter/plugin')(on);
      // --- FIN DEL REGISTRO DEL PLUGIN ---

      return config; // Es importante retornar el objeto config
    },
    // Global E2E test configurations:
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 8000, // Increased default timeout for commands
    chromeWebSecurity: false,    // Disables Chrome's web security; useful for cross-origin iframes (like ads)
    specPattern: 'cypress/e2e/**/*.cy.js', // Pattern to find test files
    downloadsFolder: 'cypress/downloads',    // Explicitly set or confirm the downloads folder path
  },
});