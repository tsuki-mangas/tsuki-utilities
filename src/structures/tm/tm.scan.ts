import TmUser, { ReceivedFromApi as UserReceivedFromApi } from './tm.user';
import { format, apiRequest } from '../../utils';
import { isUrl } from '../..';

/**
 * Classe de interação com uma scan da Tsuki Mangás.
 * @since 0.1.0
 */
export default class TmScan {
	/**
	 * Id da scan.
	 * @since 0.1.0
	 */
	id?: number;

	/**
	 * Objeto de links relativos à scan.
	 * @since 0.1.0
	 */
	links?: {
		/**
		 * Link da página da scan.
		 * @since 0.1.0
		 */
		overview: string;
		/**
		 * Link do banner da scan.
		 * @since 0.1.0
		 */
		banner: string | null;
		/**
		 * Link do website da scan.
		 * @since 0.1.0
		 */
		website: string | null;
		/**
		 * Convite pro servidor do Discord da scan.
		 * @since 0.1.0
		 */
		discord: string | null;
		/**
		 * Link da página do Facebook da scan.
		 * @since 0.1.0
		 */
		facebook: string | null;
	};

	/**
	 * Nome completo da scan.
	 * @since 0.1.0
	 */
	name?: string;
	/**
	 * Sobre a scan.
	 * @since 0.1.0
	 */
	about?: string | null;

	/**
	 * Membros da scan.
	 * @since 0.1.0
	 */
	members?: TmUser[];

	/**
	 * Constructor da classe.
	 * @param data Dados recebidos (objeto) ao chamar a API.
	 * @since 0.1.0
	 */
	constructor(data?: ScanReceivedFromApi) {
		if (data) this.#buildClass(data);

		return this;
	}

	/**
	 * Preenche a classe.
	 * @private
	 * @param data Dados recebidos (objeto) ao chamar a API.
	 * @returns Retorna esta classe preenchida.
	 * @since 0.2.1
	 */
	#buildClass(data: ScanReceivedFromApi): Required<TmScan> {
		this.id = data.id;

		this.links = {
			overview: `https://tsukimangas.com/scan/${data.url}`,
			banner: data.cover
				? `https://tsukimangas.com/scan/fundo/${data.cover}`
				: null,
			website: format(data.website) || null,
			discord: format(data.discord) || null,
			facebook: format(data.facebook) || null
		};

		this.name = format(data.name);
		this.about = format(data.description) || null;

		this.members = [];
		if (data.members)
			for (const member of data.members.values())
				this.members.push(new TmUser(member.user));

		return this as Required<TmScan>;
	}

	/**
	 * Obter uma scan da Tsuki Mangás por Id.
	 * @param id Id da scan.
	 * @returns Retorna esta classe preenchida com as informações da scan.
	 * @since 0.1.0
	 */
	async getById(id: number): Promise<Required<TmScan>> {
		return this.#buildClass(
			(await apiRequest(
				'tm',
				`scans/${id}`,
				`obter a scan com Id **${id}**`
			)) as ScanReceivedFromApi
		);
	}

	/**
	 * Obter uma scan da Tsuki Mangás por slug.
	 * @param name Slug do nome da scan.
	 * @returns Retorna esta classe preenchida com as informações da scan.
	 * @since 0.1.0
	 */
	async getBySlug(slug: string): Promise<Required<TmScan>> {
		return this.#buildClass(
			(await apiRequest(
				'tm',
				`scans/${slug}`,
				`obter a scan **${slug}**`
			)) as ScanReceivedFromApi
		);
	}

	/**
	 * Procurar alguma scan na Tsuki Mangás.
	 * @param name Nome da scan.
	 * @returns Retorna uma array de classes.
	 * @since 0.1.6
	 */
	async search(name: string): Promise<Array<Required<TmScan>>> {
		const request = (await apiRequest(
				'tm',
				`scans?name=${name}`,
				`procurar a scan **${name}**`
			)) as SearchReceivedFromApi,
			results: Array<Required<TmScan>> = [];

		for (const result of request.data.values())
			results.push(this.#buildClass(result));

		return results;
	}

	/**
	 * Cria uma scan na Tsuki Mangás.
	 * @param name Nome da scan.
	 * @param url Link do site da scan.
	 * @returns Retorna esta classe preenchida.
	 * @since 0.2.1
	 */
	async create(name: string, url?: string): Promise<Required<TmScan>> {
		if (url && !isUrl(url, false)) throw new Error('O url não é válido.');

		const payload = { name, website: url ?? '' },
			request = (await apiRequest(
				'tm',
				'scans',
				`criar a scan **${name}**`,
				'POST',
				payload
			)) as ScanReceivedFromApi;

		return this.#buildClass(request);
	}

	/**
	 * Apagar uma scan da Tsuki Mangás.
	 * @returns Retorna esta classe preenchida.
	 * @since 0.2.1
	 */
	async delete(): Promise<Required<TmScan>> {
		if (!this.id || !this.name)
			throw new Error(
				"A classe tem que ser preenchida primeiro. Use o método 'getById', 'getBySlug' ou 'search' para isso."
			);

		await apiRequest(
			'tm',
			`scans/${this.id}`,
			`apagar a scan **${this.name}**`,
			'DELETE'
		);

		return this as Required<TmScan>;
	}
}

/**
 * Objeto recebido ao chamar a API.
 * @private
 * @since 0.1.0
 */
export type ScanReceivedFromApi = {
	id: number;
	url: string;
	name: string;
	cover: string;
	description: string;
	website: string;
	discord: string;
	facebook: string;
	members: Array<{
		user: UserReceivedFromApi;
	}>;
};

/**
 * Objeto recebido ao chamar a API.
 * @private
 * @since 0.1.6
 */
type SearchReceivedFromApi = {
	data: ScanReceivedFromApi[];
};
