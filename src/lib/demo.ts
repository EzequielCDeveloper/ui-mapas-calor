// Demo mode configuration
// Set to true to restrict all write operations

export const IS_DEMO_MODE = true

export function showDemoMessage() {
  // This function shows a toast message when write operations are attempted
  // It's implemented in the components that handle user actions
  return 'Función deshabilitada en modo demo'
}
