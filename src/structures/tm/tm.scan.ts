import TmUser, { ReceivedFromApi as UserReceivedFromApi } from './tm.user';
import { format, apiRequest } from '../../utils';

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
		banner: string;
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
	 * @param beautify Embelezar os dados?
	 * Se sim, todos os dados de utilizador (nome, sobre, etc.) serão tratados.
	 * Exemplo:
	 *    - 'traduzimos mangás desde janeiro' vira 'traduzimos mangás desde janeiro'
	 *    - ' traduzimos só aquilo que lemos ' vira 'traduzimos só aquilo que lemos'
	 * @returns Se data for definido, retorna a classe preenchida. Se não, retorna a classe vazia.
	 * @since 0.1.0
	 */
	constructor(data?: ReceivedFromApi, beautify = true) {
		if (!data) return this;

		this.id = data.id;

		this.links = {
			overview: `https://tsukimangas.com/scan/${data.url}`,
			banner: `https://tsukimangas.com/scan/fundo/${data.cover}`,
			website: data.website || null,
			discord: data.discord || null,
			facebook: data.facebook || null
		};

		this.name = data.name;
		this.about = data.description || null;

		this.members = [];
		for (const member of data.members.values())
			this.members.push(new TmUser(member.user));

		if (beautify) {
			if (this.links.website) format(this.links.website);
			if (this.links.discord) format(this.links.discord);
			if (this.links.facebook) format(this.links.facebook);
			this.name = format(this.name);
			if (this.about) this.about = format(this.about);
		}

		return this;
	}

	/**
	 * Obter uma scan da Tsuki Mangás por Id.
	 * @param id Id da scan.
	 * @returns Retorna esta classe preenchida com as informações da scan.
	 * @since 0.1.0
	 */
	async getById(id: number): Promise<TmScan> {
		return new TmScan(
			(await apiRequest(
				'tm',
				`scans/${id}`,
				`obter a scan com Id **${id}**`
			)) as ReceivedFromApi
		);
	}

	/**
	 * Obter uma scan da Tsuki Mangás por slug.
	 * @param name Slug do nome da scan.
	 * @returns Retorna esta classe preenchida com as informações da scan.
	 * @since 0.1.0
	 */
	async getBySlug(slug: string): Promise<TmScan> {
		return new TmScan(
			(await apiRequest(
				'tm',
				`scans/${slug}`,
				`obter a scan ${slug}`
			)) as ReceivedFromApi
		);
	}
}

/**
 * Objeto recebido ao chamar a API.
 * @private
 * @since 0.1.0
 */
type ReceivedFromApi = {
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
