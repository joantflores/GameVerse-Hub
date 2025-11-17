// Sólo utilidades / constantes para compartir entre archivos (no exporta componentes)
export const TOAST_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  ERROR: "error"
};

export function formatToastMessage(title, body) {
  return { title, body };
}