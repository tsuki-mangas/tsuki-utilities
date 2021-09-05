import TmScan, { ReceivedFromApi as TmScanReceivedFromApi } from './tm.scan';
import TmUser, { ReceivedFromApi as TmUserReceivedFromApi } from './tm.user';
import { apiRequest, format } from '../../utils';

export default class TmChapter {
	/**
	 * Objeto de Ids relativos à obra.
	 * @since 0.1.3
	 */
	ids?: {
		/**
		 * Id da página na Tsuki Mangás.
		 * @since 0.1.3
		 */
		page: number;
		/**
		 * Id do capítulo na Tsuki Mangás. Atenção, o Id do capítulo e das versões são diferentes. Cada versão tem 1 Id mas todas as versões têm o mesmo Id do capítulo; este.
		 * @since 0.1.3
		 */
		chapter: number;
		/**
		 * Id do uploader.
		 * @since 0.1.3
		 */
		uploader: number;
	};

	/**
	 * Título do capítulo.
	 * @since 0.1.3
	 */
	title?: string | null;
	/**
	 * Número do capítulo.
	 * @since 0.1.3
	 */
	number?: string;

	/**
	 * Usuário que upou o capítulo. Este campo é null quando se obtem a lista completa ('getAll'). Só com 'getPartial' é que se consegue o usuário.
	 * @since 0.1.3
	 */
	uploader?: TmUser | null;

	/**
	 * Versões do capítulo.
	 * @since 0.1.3
	 */
	versions?: Array<{
		/**
		 * Id da versão.
		 * @since 0.1.3
		 */
		id: number;
		/**
		 * Total de páginas da versão.
		 * @since 0.1.3
		 */
		pages: number;
		/**
		 * Array de scans que fizeram a versão.
		 * @since 0.1.3
		 */
		scans: TmScan[];
		/**
		 * Data de upload da versão.
		 * @since 0.1.3
		 */
		createdAt: Date;
	}>;

	/**
	 * Total de visualizações do capítulo.
	 * @since 0.1.3
	 */
	views?: number;

	/**
	 * Constructor da classe.
	 * @param data Dados recebidos (objeto) ao chamar a API.
	 * @param beautify Embelezar os dados?
	 * Se sim, todos os dados de utilizador (títulos, gêneros, sinopse, etc.) serão tratados.
	 * Exemplo:
	 *    - 'One Piece' vira 'One Piece'
	 *    - ' One Piece ' vira 'One Piece'
	 * @returns Se data for definido, retorna a classe preenchida. Se não, retorna a classe vazia.
	 * @since 0.1.3
	 */
	constructor(data?: DataType, beautify = true) {
		if (!data) return this;

		this.ids = {
			page: data.manga_id,
			chapter: data.id,
			uploader: data.user_id
		};

		this.title = data.title || null;
		this.number = data.number;

		if (data.author) this.uploader = new TmUser(data.author);
		else this.uploader = null;

		this.versions = [];
		for (const version of data.versions.values())
			this.versions.push({
				id: version.id,
				pages: version.total_pages,
				scans: version.scans.map((scanObject) => new TmScan(scanObject.scan)),
				createdAt: new Date(version.created_at.replace(/-/g, '/'))
			});

		this.views = data.views;

		if (beautify) if (this.title) this.title = format(this.title);
	}

	/**
	 * Obter a lista completa de capítulos de uma obra na Tsuki Mangás.
	 * @param pageId Id da página na Tsuki Mangás.
	 * @returns Retorna uma array de classes.
	 * @since 0.1.3
	 */
	async getAll(pageId: number): Promise<TmChapter[]> {
		const request = (await apiRequest(
				'tm',
				`chapters/${pageId}/all`,
				`obter a lista de todos os capítulos da páginda com Id **${pageId}**`
			)) as AllListReceivedFromApi,
			results: TmChapter[] = [];

		for (const result of request.values()) results.push(new TmChapter(result));

		return results;
	}

	/**
	 * Obter a lista parcial (20) de capítulos de uma obra na Tsuki Mangás.
	 * @param pageId Id da página na Tsuki Mangás.
	 * @param filter Filtro de busca: ordem e página. A valor padrão da ordem é 'asc' e da página é 1.
	 * @returns Retorna uma array de classes.
	 * @since 0.1.3
	 */
	async getPartial(
		pageId: number,
		filter?: { order?: 'asc' | 'desc'; page?: number }
	): Promise<TmChapter[]> {
		if (!filter || (!filter.order && filter.page === undefined))
			filter = { order: 'asc', page: 1 };
		if (!filter.order && filter.page !== undefined)
			filter = { order: 'asc', page: filter.page };
		if (filter.page === undefined) filter = { order: filter.order, page: 1 };

		const request = (await apiRequest(
				'tm',
				`chapters?manga_id=${pageId}&order=${filter.order}&page=${filter.page}`,
				`obter a lista parcial de capítulos da páginda com Id **${pageId}`
			)) as PartialListReceivedFromApi,
			results: TmChapter[] = [];

		for (const result of request.data.values())
			results.push(new TmChapter(result));

		return results;
	}
}

/**
 * Tipo global de um capítulo recebido pela API.
 * @private
 * @since 0.1.3
 */
type DataType =
	| AllListReceivedFromApi[number]
	| PartialListReceivedFromApi['data'][number];

/**
 * Array recebida ao chamar o endpoint de todos os capítulos ('getAll').
 * @private
 * @since 0.1.3
 */
type AllListReceivedFromApi = Array<PartialListReceivedFromApi['data'][number]>;

/**
 * Objeto recebido ao chamar o endpoint da lista parcial de capítulos ('getPartial').
 * @private
 * @since 0.1.3
 */
type PartialListReceivedFromApi = {
	data: Array<{
		id: number;
		manga_id: number;
		user_id: number;
		number: string;
		title: string;
		views: number;
		versions: [
			{
				id: number;
				chapter_id: number;
				user_id: number;
				total_pages: number;
				created_at: string;
				scans: [
					{
						id: number;
						chapter_version_id: number;
						scan_id: number;
						scan: TmScanReceivedFromApi;
					}
				];
			}
		];
		author?: TmUserReceivedFromApi;
	}>;
};
