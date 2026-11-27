/**
 * @fileoverview
 * Extrae el mensaje de error de una respuesta del backend.
 * `ValidationPipe` devuelve `message` como array de cadenas, así que hay que
 * normalizarlo antes de mostrarlo (Analisis004 T6-1ter).
 * @module utilities/apiErrorMessage
 * @author Braulio Rodriguez <brauliorg@gmail.com>
 * @version 0.1.0
 */

/**
 * Devuelve el mensaje como texto plano. Array → se unen las cadenas válidas.
 * Cualquier otra forma devuelve cadena vacía.
 */
export function extractApiMessage(raw: unknown): string {
  if (typeof raw === 'string') return raw.trim();
  if (Array.isArray(raw)) {
    return raw
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
      .join('. ');
  }
  return '';
}
