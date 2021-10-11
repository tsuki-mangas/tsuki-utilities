/**
 * Tira todos os elementos inválidos de uma array e organiza opcionalmente por ordem alfabética.
 * @param input Input. Array de strings qualquer.
 * @param sort Organizar a array por ordem alfabética?
 * @returns Retorna a array tratada.
 * @since 0.1.7
 */
export function formatArray(input: string[], sort = true): string[] {
	let toReturn: string[] = [];
	toReturn = [...new Set(input)].filter(Boolean);
	toReturn = [...new Map(toReturn.map((s) => [s.toLowerCase(), s])).values()];
	if (sort) toReturn.sort(Intl.Collator().compare);
	return toReturn;
}

/**
 * Divide uma array em vários pedaços.
 * @param array Input. Array qualquer.
 * @param chunkSize Quantos elementos por array?
 * @returns Retorna uma array de arrays.
 * @since 0.1.7
 */
export function createChunks<T>(input: T[], chunkSize: number): T[][] {
	const tempArray: T[][] = [];
	while (input.length > 0) tempArray.push(input.splice(0, chunkSize));
	return tempArray;
}
