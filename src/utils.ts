import ApiRequestError from './structures/api.request.error';
import { dirname, join, parse } from 'path';
import { IncomingMessage } from 'http';
import { readFile } from 'fs/promises';
import { readFileSync } from 'fs';
import { request } from 'https';
import {
	AvailableWebsites,
	AvailableWebsitesShort
} from './types/package.types';

const maxRequestsPerSecond = 10,
	boundary = `tsuki-boundary-${Date.now().toString(16)}`;
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
 * Tira os espaços a mais de uma string.
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
	for (const str of new Map(
		tempArray.map((s) => [s.toLowerCase(), s])
	).values())
		input.push(str);

	if (formatElements) input.map((element) => format(element));
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
			return 'api.mangadex.org';
		case 'al':
			return 'graphql.anilist.co';
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
			return `/${endpoint}`;
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
		 * Seria melhor dar split diretamente, mas há o risco da value conter um '='.
		 * Por tanto, para não ter que tratar desse problema, simplesmente trocamos
		 * o primeiro '=' por ';;;', já que a chance da value conter ';;;' é extremamente baixa.
		 */
		envVariable = envVariable.replace('=', ';;;');
		const splitted = envVariable.split(';;;'),
			hasLineReturn = splitted[1].endsWith('\r');

		process.env[splitted[0]] = hasLineReturn
			? splitted[1].replace(new RegExp('\r'), '')
			: splitted[1];
	}
}

/**
 * Trata um erro recebido por alguma API.
 * @private
 * @param website Iniciais do site.
 * @param endpoint Endpoint da API.
 * @param action Porque esta chamada foi feita?
 * @param response Objeto de resposta do package https.
 * @param responsePayload Resposta da API.
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
	response: IncomingMessage,
	responsePayload: string
): ApiRequestError {
	const websiteName = short2long(website),
		websiteGenre = website === 'mal' ? 'o' : 'a';

	let message = `Ocorreu um erro ${response.statusCode} ao tentar ${action} n${websiteGenre} ${websiteName}.`;
	if (response.statusCode === 429)
		message = `Eu estou tomando ratelimit d${websiteGenre} ${websiteName}.`;

	return new ApiRequestError(message, endpoint, responsePayload);
}

/**
 * Criar um multipart payload.
 * @private
 * @param object Objeto a mandar para a API.
 * @returns Retorna um Buffer.
 * @since 0.1.3
 */
export async function createMultipartPayload(
	object: Record<string, string[] | string | number[] | number>
): Promise<Buffer> {
	const dataArray: Array<string | Buffer> = [];

	for (const property of Object.keys(object).values()) {
		if (object[property] === undefined) continue;
		// ---------- \\
		else if (property.endsWith('_path') || property.endsWith('_path_array'))
			if (object[property] === '')
				dataArray.push(
					`--${boundary}\r\nContent-Disposition: form-data; name="${property.replace(
						'_path',
						''
					)}\r\n`
				);
			else {
				if (typeof object[property] === 'string')
					object[property] = [object[property] as string];

				for (const path of (object[property] as string[]).values()) {
					dataArray.push(
						`--${boundary}\r\nContent-Disposition: form-data; name="${property
							.replace('_path', property.endsWith('_path_array') ? '[]' : '')
							.replace('_array', '')}"; filename="${
							parse(path).base
						}"\r\nContent-Type: ${
							object[property].toString().endsWith('png')
								? 'image/png'
								: 'image/jpeg'
						}\r\n\r\n`
					);
					dataArray.push(readFileSync(path));
				}
			}
		// ---------- \\
		else if (property.endsWith('_array'))
			if (!Array.isArray(object[property])) continue;
			else {
				const propertyArray = object[property] as string[];
				if (propertyArray.length === 0) continue;
				else
					propertyArray.forEach((value, i) => {
						dataArray.push(
							`--${boundary}\r\nContent-Disposition: form-data; name="${property.replace(
								'_array',
								'[]'
							)}"\r\n\r\n`
						);
						dataArray.push(
							value + (propertyArray.length === i + 1 ? '' : '\r\n')
						);
					});
			}
		// ---------- \\
		else {
			dataArray.push(
				`--${boundary}\r\nContent-Disposition: form-data; name="${property}"\r\n\r\n`
			);
			dataArray.push(object[property].toString());
		}

		dataArray.push(`\r\n`);
	}

	dataArray.push(`--${boundary}--\r\n`);

	return Buffer.concat(
		dataArray.map((element) =>
			element instanceof Buffer
				? Buffer.from(element)
				: Buffer.from(element.toString(), 'utf8')
		)
	);
}

/**
 * Prepara, envia, recebe, trata as chamadas de alguma API.
 * @private
 * @param website Iniciais do site.
 * @param endpoint Endpoint da API.
 * @param action Motivo da chamada.
 * @param method Método HTTP.
 * @param requestPayload Objeto Json ou Buffer.
 * @param additionalHeaders Objeto de headers adicionais.
 * @returns Retorna a resposta da API.
 * @since 0.1.0
 */
export async function apiRequest(
	website: AvailableWebsitesShort,
	endpoint: string,
	action: string,
	method = 'GET' as 'GET' | 'POST' | 'DELETE',
	requestPayload = {} as Record<string, unknown> | Buffer,
	additionalHeaders = {} as Record<string, string>
): Promise<unknown> {
	if (website === 'tm') {
		await checkEnvFile();
		if (!process.env.TM_BB_TOKEN)
			throw new Error('Token de block-bypass da Tsuki Mangás inválido!');
		if (method !== 'GET' && !process.env.TM_TOKEN)
			throw new Error('Token da Tsuki Mangás inválido!');
	}

	activeRequests++;
	if (activeRequests >= maxRequestsPerSecond)
		await new Promise((resolve) =>
			setTimeout(
				resolve,
				1000 * Math.floor(activeRequests / maxRequestsPerSecond)
			)
		);

	const headers = { ...additionalHeaders };
	if (website === 'tm') {
		headers['Authorization'] = process.env.TM_TOKEN as string;
		headers['Session-App-Key'] = process.env.TM_BB_TOKEN as string;
		if (process.env.TM_RLB_TOKEN)
			headers['X-CSRF-TOKEN'] = process.env.TM_RLB_TOKEN;
	} else if (website === 'mal') headers['If-None-Match'] = 'ETag';
	else if (website === 'al') headers['Accept'] = 'application/json';

	if (requestPayload instanceof Buffer) {
		headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
		headers['Content-Length'] = requestPayload.byteLength.toString();
	} else headers['Content-Type'] = 'application/json';

	Object.assign(headers, additionalHeaders);

	return new Promise(async (resolve, reject) => {
		const req = request(
			{
				hostname: getHostname(website),
				path: buildPath(website, encodeURI(endpoint)),
				method,
				headers
			},
			(response) => {
				let responsePayload = '';

				response.on('data', (data) => {
					responsePayload += data;
				});

				response.on('end', () => {
					activeRequests--;

					if (response.statusCode && response.statusCode < 300) {
						const parsedResponseObject = JSON.parse(responsePayload);
						resolve(parsedResponseObject);
					} else
						reject(
							handleError(website, endpoint, action, response, responsePayload)
						);
				});
			}
		);

		if (method !== 'GET')
			requestPayload instanceof Buffer
				? req.write(requestPayload)
				: req.write(JSON.stringify(requestPayload));

		req.end();
	});
}
