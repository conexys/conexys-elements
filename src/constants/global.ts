/**
 * @fileoverview
 * List of constants used in the system
 * @module constants/global
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.3.0
 */

/**
 * Resuelve la URL base de la API una sola vez y la deja inmutable.
 * `window.restAPI` se define de forma no escribible y no configurable para
 * evitar que un script de terceros (o la consola) la reescriba y redirija
 * el tráfico. Si ya existe se respeta su valor; si no, cae a '' (relativo).
 */
const REST_API_KEY = 'restAPI';

function resolveRestAPI(): string {
  let value: string;
  if (typeof window !== 'undefined') {
    const existing = (window as any)[REST_API_KEY];
    if (typeof existing === 'string' && existing.length > 0) {
      value = existing;
    } else {
      value = '';
    }
    // Congelar: no reescribible ni reconfigurable.
    try {
      Object.defineProperty(window, REST_API_KEY, {
        value,
        writable: false,
        configurable: false,
        enumerable: true,
      });
    } catch {
      // Si ya fue definida como no-configurable, no pasa nada.
    }
  } else {
    value = '';
  }
  return value;
}

const Url: string = resolveRestAPI();

export { Url };
