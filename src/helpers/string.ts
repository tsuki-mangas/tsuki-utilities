import { URL } from 'url';

/**
 * Torna maiúscula a letra inicial de um texto.
 * @param input Input. String qualquer.
 * @returns Retorna a string com a letra inicial maiúscula.
 * @since 0.1.7
 */
export function capitalize(input: string): string {
	return input.charAt(0).toUpperCase() + input.slice(1);
}

/**
 * Tira todos os espaços a mais de um texto.
 * @param input Input. String qualquer.
 * @returns Retorna a string sem espaços a mais.
 * @since 0.1.7
 */
export function format(input: string): string {
	return input.replace(/  +/g, ' ').trim();
}

/**
 * Tira todos os espaços a mais de uma lista em string.
 * Exemplo de input: 'Solo Leveling;One Piece;Naruto'.
 * @param input Input. String qualquer.
 * @returns Retorna a string sem espaços antes e depois do separador.
 * @since 0.1.7
 */
export function formatList(input: string): string {
	return input
		.split(/\s*,\s*/g)
		.join(',')
		.split(/\s*-\s*/g)
		.join('-')
		.split(/\s*;\s*/g)
		.join(';');
}

/**
 * Troca todos os variantes de um caracter pelo 'original' (mais usado).
 * @param input Input. String qualquer.
 * @returns Retorna a string sem os variantes.
 * @since 0.1.7
 */
export function applyVariantsReplacement(input: string): string {
	return format(input)
		.split(/[‘’′‵ʹ‹›]/g)
		.join("'")
		.split(/[“”„‟″‶ʺ«»]/g)
		.join('"')
		.split(/[×]/g)
		.join("'")
		.split(/[․]/g)
		.join('.')
		.split(/[‥]/g)
		.join('..')
		.split(/[‐‑⁃]/g)
		.join('-');
}

/**
 * Transforma um hostname ('tsukimangas.com') em link completo ('https://tsukimangas.com/).
 * @param input Input. String qualquer.
 * @returns Retorna um link.
 * @since 0.1.9
 */
export function hostnameToUrl(input: string): string {
	// Forçar só 1 'https' para não ter que thrownar (sim, acabei de inventar uma palavra) um erro.
	const url = new URL(input.includes('https://') ? input : 'https://' + input);
	return url.href;
}
