/**
 * Adiciona zeros a um número (em forma de string) se necessário.
 * Esta função suporta decimais e o separador - (menos).
 * @param input Input. String qualquer.
 * @returns Retorna a string com o padding certo.
 * @since 0.1.7
 */
export function leftPad(input: string): string {
	let sign = '';
	if (input.startsWith('-')) {
		input = input.replace('-', '');
		sign = '-';
	}

	const array = input.split('-');
	array.forEach((num, i) => {
		array[i] = num.padStart(2, '0');
		if (array[i].length > 2 && array[i].startsWith('0'))
			array[i] = array[i].replace(/^[^1-9]*0/g, '').padStart(2, '0');

		if (num.includes('.')) {
			const temp = array[i].split('.');
			temp[0] = temp[0].padStart(2, '0');
			array[i] = temp.join('.');
		}
	});

	return `${sign}${array.join('-')}`;
}
