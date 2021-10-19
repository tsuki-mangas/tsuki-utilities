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

/**
 * Verifica se uma string é um link válido.
 * @param input Input. String qualquer.
 * @param allowNoHttps Permitir links sem 'https://' ?
 * @returns Retorna um boolean.
 * @since 0.1.9
 */
export function isUrl(input: string, allowNoHttps: boolean): boolean {
	// Este RegEx não é meu. Não sei de quem é nem quando o obtive.
	const pattern = new RegExp(
		`^${allowNoHttps ? '(https?:\\/\\/)?' : '(https:\\/\\/)'}` + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$',
		'i'
	);

	return pattern.test(input);
}
