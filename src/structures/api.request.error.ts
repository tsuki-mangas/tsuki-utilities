/**
 * Erro personalizado.
 * Ele aparece quando alguma API responde com algum status code superior a 300.
 * @since 0.1.1
 */
export default class ApiRequestError extends Error {
	endpoint: string;

	constructor(message: string, endpoint: string, stack: unknown) {
		super(message);

		this.name = 'ApiRequestError';
		this.endpoint = endpoint;
		this.stack = JSON.stringify(stack);
	}
}
