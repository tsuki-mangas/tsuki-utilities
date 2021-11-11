/**
 * Obter a data e hora de um país.
 * @param country País.
 * @param long Formato longo?
 * @returns Retorna uma string com a data e hora.
 * Exemplos:
 * 	- Normal: '7/11/2021 16:16:12'
 * 	- Longo: '7/11/2021 às 16:16:12 FR'
 * @since 0.2.5
 */
export function getCurrentTime(
	country: 'FR' | 'BR' = 'FR',
	long = false
): string {
	const dateAndTime = new Intl.DateTimeFormat([], {
			timeZone: country === 'FR' ? 'Europe/Paris' : 'America/Sao_Paulo',
			year: '2-digit',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
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

/**
 * Parsar uma data e hora.
 * @param date Data a parsar.
 * @param long Formato longo?
 * @returns Retorna uma string com a data e hora.
 * Exemplos:
 * 	- Normal: '7/11/2021 16:16:12'
 * 	- Longo: '7/11/2021 às 16:16:12'
 * @since 0.3.0
 */
export function parseDate(date: Date, long = false): string {
	const dateAndTime = new Intl.DateTimeFormat([], {
			year: '2-digit',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		}).formatToParts(date),
		day = dateAndTime.find((obj) => obj.type === 'day'),
		hour = dateAndTime.find((obj) => obj.type === 'hour');

	/**
	 * Eu reparei que por algum motivo, isto adiciona 1 hora.
	 * Este pedaço abaixo serve para tirá-la.
	 */
	if (day && hour && (Number(hour.value) === 0 || Number(hour.value) === 24)) {
		hour.value = String(Number(hour.value) - 1).padStart(2, '0');
		day.value = String(Number(day.value) - 1).padStart(2, '0');
	} else if (hour) hour.value = String(Number(hour.value) - 1).padStart(2, '0');

	const dateStr = `${day?.value}/${
			dateAndTime.find((obj) => obj.type === 'month')?.value
		}/${dateAndTime.find((obj) => obj.type === 'year')?.value}`,
		time = `${hour?.value}:${
			dateAndTime.find((obj) => obj.type === 'minute')?.value
		}:${dateAndTime.find((obj) => obj.type === 'second')?.value}`;

	return `${dateStr}${long ? ' às' : ''} ${time}`;
}
