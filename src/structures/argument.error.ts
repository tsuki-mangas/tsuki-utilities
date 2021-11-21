/**
 * Erro personalizado.
 * Ele aparece quando algum método foi chamado incorretamente.
 * @since 0.3.1
 */
export default class ArgumentError extends Error {
	constructor(message: string) {
		super(message);

		this.name = 'ArgumentError';
	}
}
