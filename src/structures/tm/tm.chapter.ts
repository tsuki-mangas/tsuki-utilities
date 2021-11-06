import TmUser, { ReceivedFromApi as TmUserReceivedFromApi } from './tm.user';
import { apiRequest, createFormData, format } from '../../utils';
import { PageReceivedFromApi } from './tm.page';
import TmScan, {
	ScanReceivedFromApi as TmScanReceivedFromApi
} from './tm.scan';

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
				`obter a lista parcial de capítulos da páginda com Id **${pageId}**`
			)) as PartialListReceivedFromApi,
			results: TmChapter[] = [];

		for (const result of request.data.values())
			results.push(new TmChapter(result));

		return results;
	}
	/**
	 * Upar um capítulo na Tsuki Mangás.
	 * É suposto preencher o Id da obra e número (e título se houver) do capítulo antes de executar esta função.
	 * @param pageId Id da página da obra na Tsuki Mangás.
	 * @param number Número do capítulo.
	 * @param scans Array das scans que fizeram o capítulo.
	 * @param imagesPaths Array dos caminhos de todas as imagens do capítulo.
	 * @param title Título do capítulo (se houver).
	 * @returns Retorna esta classe preenchida.
	 * @since 0.1.4
	 */
	async upload(
		pageId: number,
		number: string,
		scans: number[],
		imagesPaths: string[],
		title?: string
	): Promise<TmChapter> {
		const payloadObject = generatePayloadObject(
				pageId,
				number,
				scans,
				imagesPaths,
				title
			),
			payload = createFormData(payloadObject),
			request = (await apiRequest(
				'tm',
				'chapter/versions/upload',
				`upar o capítulo **${number}** da página **${pageId}**`,
				'POST',
				payload
			)) as UploadedChapterReceivedFromApi;

		/**
		 * A classe é preenchida aqui pois adaptar o constructor é muito trabalhoso.
		 */
		this.ids = {
			page: Number(request.chapter.manga_id),
			chapter: request.chapter_id,
			uploader: request.user_id
		};

		this.title = request.chapter.title;
		this.number = request.chapter.number;

		this.uploader = null;

		this.versions = [
			{
				id: request.id,
				pages: request.total_pages,
				scans: request.scans.map((scanObject) => new TmScan(scanObject.scan)),
				createdAt: new Date(request.created_at.replace(/-/g, '/'))
			}
		];

		this.views = 0;

		return this;
	}

	/**
	 * Editar um capítulo (completo) da Tsuki Mangás.
	 * @param title Título do capítulo.
	 * @param number Número do capítulo.
	 * @returns Retorna esta classe preenchida.
	 * @since 0.2.1
	 */
	async editChapter(title?: string, number?: string): Promise<TmChapter> {
		if (!this.ids || !this.ids.page || !this.number)
			throw new Error(
				"A classe tem que ser preenchida primeiro. Use o método 'getPartial' ou 'getAll' para isso."
			);
		else if (!title && !number)
			throw new Error(
				'Você tem que definir ou o título ou o número do capítulo.'
			);

		if (title) this.title = title;
		if (number) this.number = number;

		const payload = createFormData({
			manga_id: this.ids.page,
			title: this.title ?? '',
			number: this.number
		});

		await apiRequest(
			'tm',
			`chapters/${this.ids.chapter}`,
			`atualizar o capítulo **${this.ids.chapter}** da página **${this.ids.page}**`,
			'PUT',
			payload
		);

		return this;
	}

	/**
	 * Editar uma versão de um capítulo da Tsuki Mangás.
	 * @param versionIndex Posição da versão na array de versões.
	 * @param newScans Nova array de scans da versão.
	 * @returns Retorna esta classe preenchida.
	 * @since 0.2.1
	 */
	async editVersion(
		versionIndex: number,
		newScans: TmScan[]
	): Promise<TmChapter> {
		if (!this.ids || !this.versions)
			throw new Error(
				"A classe tem que ser preenchida primeiro. Use o método 'getPartial' ou 'getAll' para isso."
			);
		else if (!this.versions[versionIndex])
			throw new Error('Parece que essa versão não existe.');

		this.versions[versionIndex].scans = newScans;

		const payloadObject = {};
		for (const scan of newScans.values())
			if (scan) Object.assign(payloadObject, { 'scans[]': scan.id });

		await apiRequest(
			'tm',
			`chapter/versions/${this.versions[versionIndex].id}`,
			`atualizar a versão **${this.versions[versionIndex].id}** do capítulo **${this.ids.chapter}** da página **${this.ids.page}**`,
			'POST',
			payloadObject
		);

		return this;
	}

	/**
	 * Apaga um capítulo ou uma versão de um capítulo da Tsuki Mangás.
	 * @param versionIndex Posição da versão na array de versões.
	 * @returns Retorna esta classe preenchida.
	 * @since 0.2.1
	 */
	async delete(versionIndex?: number): Promise<TmChapter> {
		if (!this.ids || !this.versions)
			throw new Error(
				"A classe tem que ser preenchida primeiro. Use o método 'getPartial' ou 'getAll' para isso."
			);
		else if (versionIndex && !this.versions[versionIndex])
			throw new Error('Parece que essa versão não existe.');

		await apiRequest(
			'tm',
			versionIndex !== undefined
				? `chapter/versions/${this.versions[versionIndex].id}`
				: `chapters/${this.ids.chapter}`,
			`apagar ${
				versionIndex !== undefined
					? `a versão **${this.versions[versionIndex].id}** do`
					: 'o'
			} capítulo **${this.ids.chapter}** da página **${this.ids.page}**`,
			'DELETE'
		);

		return this;
	}
}

/**
 * Cria um objeto de um capítulo a enviar para a Api da Tsuki Mangás (para chamadas POST).
 * @param pageId Id da página da obra na Tsuki Mangás.
 * @param number Número do capítulo.
 * @param scans Array das scans que fizeram o capítulo.
 * @param imagesPaths Array dos caminhos de todas as imagens do capítulo.
 * @param title Título do capítulo (se houver).
 * @returns Retorna um objeto que vai ser tratado e depois enviado à Api da Tsuki Mangás.
 * @since 0.1.4
 */
function generatePayloadObject(
	pageId: number,
	number: string,
	scansIds: number[],
	imagesPaths: string[],
	title?: string
): Record<string, string[] | string | number[] | number> {
	return {
		manga_id: pageId,

		title: title ?? '',
		number: number,

		scans_array: scansIds.length ? scansIds : [],

		// Imagens
		files_path_array: imagesPaths ?? ''
	};
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

/**
 * Objeto recebido ao chamar o endpoint de upload.
 * @private
 * @since 0.1.4
 */
type UploadedChapterReceivedFromApi =
	PartialListReceivedFromApi['data'][number]['versions'][number] & {
		chapter: {
			id: number;
			manga: Exclude<PageReceivedFromApi, 'titles' | 'genres'>;
			manga_id: string; // Sim, a Api retorna string aqui
			number: string;
			title: string;
			updated_at: string; // Sim, a Api retorna string aqui
			user_id: number;
		};
	};
