// Import commands.ts using the ES6 import syntax
import './commands';

// Prevent TypeScript errors when accessing the Cypress object
declare global {
  namespace Cypress {
    interface Cy {
      // Add custom cypress command types here
      log(message: string): void;
    }
  }
}

// Hide fetch/XHR requests from command log
const app = window.top;
if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.setAttribute('data-hide-command-log-request', '');
  
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  app.document.head.appendChild(style);
} 