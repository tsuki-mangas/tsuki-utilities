/**
 * Obter a data e hora de um país.
 * @param country País.
 * @param long Formato longo?
 * @returns Retorna uma string com a data e hora.
 * Exemplos:
 * 	- Normal: '7/11/2021 às 16:16:12'
 * 	- Longo: '7/11/2021 16:16:12 FR'
 */
export function getCurrentTime(
	country: 'FR' | 'BR' = 'FR',
	long = false
): string {
	const dateAndTime = new Intl.DateTimeFormat([], {
			timeZone: country === 'FR' ? 'Europe/Paris' : 'America/Sao_Paulo',
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			hour12: false
		}).formatToParts(new Date()),
		date = `${dateAndTime.find((obj) => obj.type === 'day')?.value}/${
			dateAndTime.find((obj) => obj.type === 'month')?.value
		}/${dateAndTime.find((obj) => obj.type === 'year')?.value}`,
		time = `${dateAndTime.find((obj) => obj.type === 'hour')?.value}:${
			dateAndTime.find((obj) => obj.type === 'minute')?.value
		}:${dateAndTime.find((obj) => obj.type === 'second')?.value}`;

	return `${date}${long ? ' às' : ''} ${time}${long ? ' ' + country : ''}`;
}
