import { formatList } from './string';

/**
 * Esta função espera até uma condição ser preenchida, sem limite de tempo.
 * @param conditionFunction Condição.
 * @returns Não retorna nada.
 * @since 0.1.7
 */
export async function until(conditionFunction: () => boolean): Promise<void> {
	function poll(resolve: () => void): void {
		if (conditionFunction()) resolve();
		else setTimeout(() => poll(resolve), 400);
	}

	return new Promise(poll);
}

/**
 * Verifica se uma string é um número válido dependendo das decimais e separador.
 * @param input Input. String qualquer.
 * @param allowDecimal Permitir números decimais?
 * @param allowSeparator Permitir separadores?
 * @returns Retorna um boolean.
 * @since 0.1.7
 */
export function isNumber(
	input: string,
	allowDecimal: boolean,
	allowSeparator: boolean
): boolean {
	input = formatList(input);

	if (allowDecimal)
		if (allowSeparator) return /^-?\d+(\.?,?-?\d+)*$/.test(input);
		else return /^-?\d+(\.?\d+)*$/.test(input);
	else if (allowSeparator) return /^-?\d+(,?-?\d+)*$/.test(input);
	else return /^-?\d+(\d+)*$/.test(input);
}
