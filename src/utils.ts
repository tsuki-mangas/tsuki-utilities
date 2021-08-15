import { readFile } from 'fs/promises';
import { IncomingMessage } from 'http';
import { dirname, join } from 'path';
import { request } from 'https';
import {
	AvailableWebsites,
	AvailableWebsitesShort
} from './types/package.types';

const headers = {},
	maxRequestsPerSecond = 10;
let activeRequests = 0;

/**
 * Força a primeira letra de uma string a ser maiúscula.
 * Exemplo:
 * - 'one Piece' vira 'One Piece'
 * - 'one piece' vira 'One piece'
 * @private
 * @param input Alguma string.
 * @returns Retorna a string com a primeira letra maiúscula.
 * @since 0.1.0
 */
export function capitalize(input: string): string {
	return input.charAt(0).toUpperCase() + input.slice(1);
}

/**
 * Limpa os espaços a mais de uma string.
 * Exemplo:
 * - ' One Piece ' vira 'One Piece'
 * - 'One Piece' vira 'One Piece'
 * @private
 * @param input Alguma string.
 * @returns Retorna a string sempre espaços duplos ou mais.
 * @since 0.1.0
 */
export function format(input: string): string {
	return input.replace(/  +/g, ' ').trim();
}

/**
 * Remove todos os itens inválidos de uma array: null, undefined ou vazios ('').
 * @private
 * @param input Alguma string array.
 * @param formatElements Formatar os elementos? (remover os espaços duplos)
 * @param sort Organizar os itens da array por ordem alfabética?
 * @returns Retorna a string array limpa, sem elementos inválidos.
 * @since 0.1.0
 */
export function formatArray(
	input: string[],
	formatElements = true,
	sort = true
): string[] {
	const tempArray: string[] = [];

	for (const str of new Set(input).values()) tempArray.push(str);
	input = [];
	for (const str of new Map(tempArray.map(s => [s.toLowerCase(), s])).values())
		input.push(str);

	if (formatElements) input.map(element => format(element));
	if (sort) tempArray.sort(Intl.Collator().compare);

	return tempArray;
}

/**
 * Transforma as iniciais de um dos sites usados pelo package no domínio respetivo.
 * @private
 * @param website Iniciais do site.
 * @returns Retorna o domínio do site.
 * @since 0.1.0
 */
function getHostname(website: AvailableWebsitesShort): string {
	switch (website) {
		case 'tm':
			return 'tsukimangas.com';
		case 'md':
			return '';
		case 'al':
			return '';
		case 'mal':
			return 'api.jikan.moe';
	}
}

/**
 * Transforma as iniciais de um dos sites usados pelo package no caminho da API sem o domínio.
 * @private
 * @param website Iniciais do site.
 * @returns Retorna o caminho da API (sem o domínio).
 * @since 0.1.0
 */
function buildPath(website: AvailableWebsitesShort, endpoint: string): string {
	switch (website) {
		case 'tm':
			return `/api/v2/${endpoint}`;
		case 'md':
			return '';
		case 'al':
			return '';
		case 'mal':
			return `/v3/${endpoint}`;
	}
}

/**
 * Transforma as iniciais de um dos sites usados pelo package no nome completo do site.
 * @private
 * @param website Iniciais do site.
 * @returns Retorna o nome completo do site.
 * @since 0.1.0
 */
function short2long(website: AvailableWebsitesShort): AvailableWebsites {
	switch (website) {
		case 'tm':
			return 'Tsuki Mangás';
		case 'md':
			return 'MangaDex';
		case 'al':
			return 'AniList';
		case 'mal':
			return 'MyAnimeList';
	}
}

/**
 * Lê e define environment variables de um .env no root folder.
 * Ele serve para o desenvolvimento, onde o token de block-bypass da Tsuki Mangás é guardado.
 * Se não há nenhum ficheiro .env é porque o ambiente é de produção, então é esperado que
 * o token seja definido na aplicação usando este package.
 * @private
 * @returns Nada.
 * @since 0.1.0
 */
async function checkEnvFile(): Promise<void> {
	/**
	 * O encoding é necessário para o fs retornar uma string e não um buffer.
	 */
	const fileContent = await readFile(join(dirname(__dirname), '.env'), {
		encoding: 'utf8'
	}).catch(() => null);
	if (!fileContent) return;

	const envVariables = fileContent.split('\n');
	for (let envVariable of envVariables.values()) {
		/**
		 * Seria melhor dar split, mas há o risco da key conter um '='.
		 * Por tanto, para não ter que tratar desse problema, simplesmente trocamos
		 * o primeiro '=' por ';;;', já que a chance da key conter ';;;' é extremamente baixa.
		 */
		envVariable = envVariable.replace('=', ';;;');
		const splitted = envVariable.split(';;;');

		process.env[splitted[0]] = splitted[1];
	}
}

/**
 * Trata um erro recebido por alguma API.
 * @private
 * @param website Iniciais do site.
 * @param endpoint Endpoint da API.
 * @param action Porque esta chamada foi feita?
 * @param debug Ativar as informações de debug (número do erro, por exemplo) nas repostas?
 * @param response Resposta da API.
 * @returns Retorna uma mensagem de erro.
 * É suposto esta mensagem ser diretamente usada nas aplicações usando este package.
 * Exemplo:
 * - 'Ocorreu um erro 401 ao tentar obter as informaçõesda obra de ID 1 na Tsuki Mangás.'
 * - 'Eu estou tomando ratelimit do MyAnimeList.'
 * @since 0.1.0
 */
function handleError(
	website: AvailableWebsitesShort,
	endpoint: string,
	action: string,
	debug: boolean,
	response: IncomingMessage
): string {
	const websiteName = short2long(website),
		websiteGenre = website === 'mal' ? 'o' : 'a';

	let message = `Ocorreu um erro ${response.statusCode} ao tentar ${action} n${websiteGenre} ${websiteName}.`;
	if (debug) message = message + `\nEndpoint: ${endpoint}`;

	if (response.statusCode === 429)
		return `Eu estou tomando ratelimit d${websiteGenre} ${websiteName}.`;
	else return message;
}

/**
 * Prepara, envia, recebe, trata as chamadas a alguma API.
 * @private
 * @param website Iniciais do site.
 * @param endpoint Endpoint da API.
 * @param action Porque esta chamada foi feita?
 * @param method Método HTTP.
 * @param requestPayload Json-body.
 * @param additionalHeaders Objeto de headers adicionais.
 * @param debug Ativar as informações de debug (número do erro, por exemplo) nas repostas?
 * @returns Retorna a resposta da API.
 * @since 0.1.0
 */
export async function apiRequest(
	website: AvailableWebsitesShort,
	endpoint: string,
	action: string,
	method = 'GET',
	requestPayload = {},
	additionalHeaders = {},
	debug = true
): Promise<unknown> {
	if (website === 'tm') {
		await checkEnvFile();
		if (!process.env.TM_BB_TOKEN)
			throw new Error('Token de block-bypass da Tsuki Mangás inválido!');
	}

	activeRequests++;
	if (activeRequests >= maxRequestsPerSecond)
		await new Promise(resolve =>
			setTimeout(
				resolve,
				1000 * Math.floor(activeRequests / maxRequestsPerSecond)
			)
		);

	if (website === 'tm')
		Object.assign(headers, {
			'Session-App-Key': process.env.TM_BB_TOKEN
		});
	else if (website === 'mal')
		Object.assign(headers, {
			'If-None-Match': 'ETag'
		});

	Object.assign(headers, additionalHeaders);

	return new Promise(async (resolve, reject) => {
		const req = request(
			{
				hostname: getHostname(website),
				path: buildPath(website, endpoint),
				method,
				headers:
					method === 'GET'
						? headers
						: { ...headers, 'content-type': 'application/json' }
			},
			response => {
				let responsePayload = '';

				response.on('data', data => {
					responsePayload += data;
				});

				response.on('end', () => {
					activeRequests--;

					if (response.statusCode && response.statusCode < 300) {
						const parsedResponseObject = JSON.parse(responsePayload);
						resolve(parsedResponseObject);
					} else
						reject(
							new Error(handleError(website, endpoint, action, debug, response))
						);
				});
			}
		);

		if (method !== 'GET') req.write(JSON.stringify(requestPayload));

		req.end();
	});
}

/**
 * Transforma uma string em um slug.
 * Exemplo:
 * - 'One Piece' vira 'one-piece'
 * - 'Drope Scan' vira 'drope-scan'
 * @private
 * @param input Alguma string.
 * @returns Versão slugged da string.
 * @since 0.1.0
 */
export function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/áàâã/g, 'a')
		.replace(/éèê/g, 'e')
		.replace(/íì/g, 'i')
		.replace(/óòôõ/g, 'o')
		.replace(/úù/g, 'u')
		.replace(/ç/g, 'c')
		.replace(/ /g, '-');
}
