// Utils
import {
	MalFormatsTypePt,
	MalFormatsTypeEn,
	MalFormats
} from '../../types/mal.types';
import { apiRequest, format } from '../../utils';

/**
 * Classe de interação com a pesquisa de uma obra no MyAnimeList.
 * @since 0.1.3
 */
export default class MalPageSearch {
	/**
	 * Resultados da pesquisa.
	 * @since 0.1.3
	 */
	results: PartialMalPage[] = [];

	/**
	 * Input. Texto a procurar.
	 * @since 0.1.3
	 */
	query: string;
	/**
	 * Limite de resultados.
	 * @since 0.1.3
	 */
	limit: number;

	/**
	 * Constructor da classe.
	 * @param query Input. Texto a procurar.
	 * @param limit Limite de resultados.
	 * @returns Retorna esta classe preenchida.
	 * @since 0.1.3
	 */
	constructor(query: string, limit = 5) {
		this.query = query;
		this.limit = limit;

		return this;
	}

	/**
	 * Iniciar a busca.
	 * @param beautify Embelezar os dados?
	 * Se sim, todos os dados de utilizador (títulos, gêneros, sinopse, etc.) serão tratados.
	 * Exemplo:
	 *    - 'One Piece' vira 'One Piece'
	 *    - ' One Piece ' vira 'One Piece'
	 * @returns Retorna esta classe preenchida com as informações da obra.
	 * @since 0.1.3
	 */
	async run(beautify = true): Promise<MalPageSearch> {
		const request = (await apiRequest(
			'mal',
			`search/manga?q=${this.query}&limit=${this.limit}`,
			`procurar **${this.query}**`
		)) as ReceivedFromApi;

		for (const result of request.results.values()) {
			if (
				result.title ===
				'Demon Ruler: Teiji ni Kaeritai Otoko no Yarisugi Leveling'
			)
				console.log(result);
			this.results.push({
				id: result.mal_id,

				links: {
					overview: result.url,
					cover: result.image_url
				},

				title: beautify ? format(result.title) : result.title,

				format: MalFormats[result.type],

				synopsis: result.synopsis
					? beautify
						? format(result.synopsis)
						: result.synopsis
					: null,

				volumes: result.volumes || null,
				chapters: result.chapters || null
			});
		}

		return this;
	}
}

/**
 * Objeto recebido ao chamar a API.
 * @private
 * @since 0.1.3
 */
type ReceivedFromApi = {
	results: Array<{
		mal_id: number;
		url: string;
		image_url: string;
		title: string;
		publishing: true;
		synopsis: string;
		type: MalFormatsTypeEn;
		chapters: number;
		volumes: number;
		score: number;
		start_date: string;
		end_date: null;
		members: number;
	}>;
};

/**
 * Página parcial do MyAnimeList.
 * @private
 * @since 0.1.3
 */
type PartialMalPage = {
	/**
	 * Id da obra no MyAnimeList.
	 * @since 0.1.3
	 */
	id: number;

	/**
	 * Objeto de links relativos à obra.
	 * @since 0.1.3
	 */
	links: {
		/**
		 * Link completo da página.
		 * Exemplo: https://myanimelist.net/manga/37707/Shigatsu_wa_Kimi_no_Uso
		 * @since 0.1.3
		 */
		overview: string;
		/**
		 * Link da cover principal da obra.
		 * Exemplo: https://cdn.myanimelist.net/images/manga/3/102691l.webp
		 * @since 0.1.3
		 */
		cover: string;
	};

	/**
	 * Título principal da obra.
	 * @since 0.1.3
	 */
	title: string;

	/**
	 * Formato da obra.
	 * @since 0.1.3
	 */
	format: MalFormatsTypePt;

	/**
	 * Sinopse da obra.
	 * @since 0.1.3
	 */
	synopsis: string | null;

	/**
	 * Número de volumes da obra.
	 * @since 0.1.3
	 */
	volumes: number | null;
	/**
	 * Número de capítulos da obra.
	 * @since 0.1.3
	 */
	chapters: number | null;
};
