import { apiRequest, createFormData, format, formatArray } from '../../utils';
import {
	TmFormats,
	TmFormatsIdType,
	TmFormatsLabelType,
	TmDemographics,
	TmDemographicsIdType,
	TmDemographicsLabelType,
	TmStatuses,
	TmGenres,
	TmGenresType
} from '../../types/tm.types';

/**
 * Classe de interação com obras da Tsuki Mangás.
 * @since 0.1.0
 */
export default class TmPage {
	/**
	 * Objeto de Ids relativos à obra.
	 * @since 0.1.0
	 */
	ids?: {
		/**
		 * Id da obra na Tsuki Mangás.
		 * @since 0.1.0
		 */
		tm: number;
		/**
		 * Id da obra na MangaDex.
		 * Este Id corresponde ao formato de Id antigo, da v3 da MangaDex.
		 * @since 0.1.0
		 */
		md: number | null;
		/**
		 * Id da obra na AniList.
		 * @since 0.1.0
		 */
		al: number | null;
		/**
		 * Id da obra no MyAnimeList.
		 * @since 0.1.0
		 */
		mal: number | null;
	};

	/**
	 * Objeto de links relativos à obra.
	 * @since 0.1.0
	 */
	links?: {
		/**
		 * Link completo do trailer da obra no YouTube.
		 * Exemplo: https://www.youtube.com/watch?v=PXNQVvQa-FI
		 * @todo Adicionar um check (data.trailer pode ser um link completo)
		 * @since 0.1.0
		 */
		trailer: string | null;
		/**
		 * Parte do link depois do Id da obra. Slug.
		 * Exemplo: miki-san-daisuki-desu
		 * @since 0.1.0
		 */
		slug: string;
		/**
		 * Link completo da página.
		 * Exemplo: https://tsukimangas.com/obra/2358/miki-san-daisuki-desu
		 * @since 0.1.0
		 */
		overview: string;
		/**
		 * Link da cover da obra.
		 * Exemplo: https://tsukimangas.com/imgs/2358.jpg?t=1609990362534
		 * @since 0.1.0
		 */
		cover: string;
		/**
		 * Link do banner da obra.
		 * Exemplo: https://tsukimangas.com/imgs/86-capa.jpg?t=1610854364475
		 * @since 0.1.0
		 */
		banner: string | null;
	};

	/**
	 * Objeto relativo aos títulos da obra.
	 * @since 0.1.0
	 */
	titles?: {
		/**
		 * Título principal da obra.
		 * @since 0.1.0
		 */
		principal: string;
		/**
		 * Títulos alternativos da obra excluindo o principal (todos os idiomas incluídos).
		 * @since 0.1.0
		 */
		alternatives: string[];
	};

	/**
	 * Autores da obra.
	 * @since 0.1.0
	 */
	authors?: string[];
	/**
	 * Artistas da obra.
	 * @since 0.1.0
	 */
	artists?: string[];

	/**
	 * Formato da obra.
	 * @since 0.1.0
	 */
	format?: {
		id: TmFormatsIdType;
		label: TmFormatsLabelType;
	} | null;

	/**
	 * Demografia da obra.
	 * @since 0.1.0
	 */
	demographic?: {
		id: TmDemographicsIdType;
		label: TmDemographicsLabelType;
	} | null;

	/**
	 * Obra adulta?
	 * @since 0.1.0
	 */
	adult?: boolean;
	/**
	 * Status de publicação da obra.
	 * @since 0.1.0
	 */
	status?: TmStatuses;
	/**
	 * Sinopse da obra.
	 * @since 0.1.0
	 */
	synopsis?: string | null;

	/**
	 * Gêneros da obra.
	 * @since 0.1.0
	 */
	genres?: TmGenresType[];

	/**
	 * Objeto relativo aos capítulos da obra.
	 * @since 0.1.0
	 */
	chapters?: {
		/**
		 * Número total de capítulos da obra.
		 * @since 0.1.0
		 */
		total: number;
		/**
		 * Objeto relativo ao dia e hora de publicação do último capítulo da obra.
		 * @since 0.1.0
		 */
		lastPubishedAt: Date | null;
	};

	/**
	 * Objeto relativo aos votos da obra.
	 * @since 0.1.0
	 */
	rating?: {
		/**
		 * Total de votos da obra.
		 * @since 0.1.0
		 */
		total: number;
		/**
		 * Média dos votos da obra.
		 * @since 0.1.0
		 */
		average: number | null;
	};

	/**
	 * Objeto relativo às visualizações da obra.
	 * @since 0.1.0
	 */
	views?: {
		/**
		 * Total de visualizações da obra.
		 * @since 0.1.0
		 */
		total: number;
		/**
		 * Total de visualizações da obra hoje.
		 * @since 0.1.0
		 */
		today: number;
		/**
		 * Total de visualizações da obra este mês.
		 * @since 0.1.0
		 */
		thisMonth: number;
	};

	/**
	 * Data na qual a páginda da obra foi criada.
	 * @since 0.2.4
	 */
	createdAt?: Date | null;
	/**
	 * Data da última atualização da páginda da obra.
	 * @since 0.2.4
	 */
	updatedAt?: Date;

	/**
	 * Constructor da classe.
	 * @param data Dados recebidos (objeto) ao chamar a API.
	 * @since 0.1.0
	 */
	constructor(data?: PageReceivedFromApi) {
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
	#buildClass(data: PageReceivedFromApi): Required<TmPage> {
		this.ids = {
			tm: data.id,
			md: data.dex_id,
			al: data.anilist_id,
			mal: data.mal_id
		};

		this.links = {
			trailer: data.trailer?.length
				? format(`https://www.youtube.com/watch?v=${data.trailer}`)
				: null,
			slug: data.url,
			overview: `https://tsukimangas.com/obra/${data.id}/${data.url}`,
			cover: `https://tsukimangas.com/imgs/${data.poster}`,
			banner:
				data.cover !== 'nobackground.jpg'
					? `https://tsukimangas.com/imgs/${data.cover}`
					: null
		};

		this.titles = {
			principal: format(data.title),
			alternatives: data.titles?.length
				? formatArray(
						data.titles?.map((title) => title.title),
						true,
						false
				  )
				: []
		};

		this.authors = data.author?.length
			? formatArray(data.author.split(', '), true, false)
			: [];
		this.artists = data.artist?.length
			? formatArray(data.artist.split(', '), true, false)
			: [];

		if (data.format >= 1 && data.format <= 4)
			this.format = {
				id: data.format as TmFormatsIdType,
				label: TmFormats[data.format] as TmFormatsLabelType
			};
		else this.format = null;

		if (data.demography && data.demography >= 1 && data.demography <= 4)
			this.demographic = {
				id: data.demography as TmDemographicsIdType,
				label: TmDemographics[data.demography] as TmDemographicsLabelType
			};
		else this.demographic = null;

		this.adult = data.adult_content ? true : false;
		this.status = data.status;
		this.synopsis = data.synopsis?.length ? format(data.synopsis) : null;

		this.genres = [];
		if (data.genres)
			for (const genre of data.genres.values())
				if (inputIsGenre(genre.genre)) this.genres.push(format(genre.genre));

		this.chapters = {
			total: data.chapters_count,
			lastPubishedAt: data.last_published_at
				? new Date(data.last_published_at.replace(/-/g, '/'))
				: null
		};

		this.rating = {
			total: data.total_rating,
			average: data.rating
		};

		this.views = {
			total: data.views,
			today: data.views_day,
			thisMonth: data.views_month
		};

		this.createdAt = data.created_at
			? new Date(data.created_at.replace(/-/g, '/'))
			: null;
		this.updatedAt = new Date(data.updated_at.replace(/-g/, '/'));

		return this as Required<TmPage>;
	}

	/**
	 * Obter uma obra da Tsuki Mangás.
	 * @param id Id da obra.
	 * @returns Retorna esta classe preenchida com as informações da obra.
	 * @since 0.1.0
	 */
	async get(id: number): Promise<Required<TmPage>> {
		return this.#buildClass(
			(await apiRequest(
				'tm',
				`mangas/${id}`,
				`obter a obra com Id **${id}**`
			)) as PageReceivedFromApi
		);
	}

	/**
	 * Procurar alguma obra na Tsuki Mangás.
	 * @param query Input. Texto a procurar.
	 * @returns Retorna uma array de classes.
	 * @since 0.1.3
	 */
	async search(query: string): Promise<Array<Required<TmPage>>> {
		const request = (await apiRequest(
				'tm',
				`mangas?title=${query}`,
				`procurar **${query}**`
			)) as SearchReceivedFromApi,
			results: Array<Required<TmPage>> = [];

		for (const result of request.data.values())
			results.push(this.#buildClass(result));

		return results;
	}

	/**
	 * Cria uma página na Tsuki Mangás.
	 * @param coverPath Caminho da cover da obra.
	 * @param bannerPath Caminho do banner dao bra.
	 * @returns Retorna esta classe preenchida com as informações da obra.
	 * @since 0.1.3
	 */
	async create(
		coverPath: string,
		bannerPath?: string
	): Promise<Required<TmPage>> {
		const payloadObject = generatePayloadObject(this, coverPath, bannerPath),
			payload = createFormData(payloadObject),
			request = (await apiRequest(
				'tm',
				'mangas',
				`criar a página **${this.titles?.principal}**`,
				'POST',
				payload
			)) as PageReceivedFromApi;

		return this.#buildClass(request);
	}

	async edit(
		coverPath?: string,
		bannerPath?: string
	): Promise<Required<TmPage>> {
		if (!this.ids?.tm)
			throw new Error(
				"Você tem que usar o método 'get' para preencher este objeto ou então preenchê-lo manualmente."
			);

		const payloadObject = generatePayloadObject(this, coverPath, bannerPath),
			payload = createFormData(payloadObject),
			request = (await apiRequest(
				'tm',
				`mangas/${this.ids?.tm}`,
				`editar a página de **${this.titles?.principal}**`,
				'POST',
				payload
			)) as PageReceivedFromApi;

		return this.#buildClass(request);
	}

	/**
	 * Deleta uma página da Tsuki Mangás.
	 * @param id Se 'id' for definido, então ele apaga a página com esse Id; se não, ele apaga a página desta classe.
	 * @returns Retorna esta classe preenchida com as informações da obra.
	 * @since 0.1.3
	 */
	async delete(id?: number): Promise<Required<TmPage>> {
		if (!id && !this.ids?.tm)
			throw new Error('Preciso de um Id antes de deletar uma página.');

		await apiRequest(
			'tm',
			`mangas/${id ?? this.ids?.tm}`,
			`deletar a obra **${this.titles?.principal}**`,
			'DELETE'
		);

		return this as Required<TmPage>;
	}
}

/**
 * Verifica se um gênero é válido na Tsuki Mangás.
 * @private
 * @param input Possível gênero.
 * @returns Retorna um boolean. Se for true, é porque o 'input' é um válido; se não, é porque não é.
 * @since 0.1.3
 */
function inputIsGenre(input: string): input is TmGenresType {
	return Object.keys(TmGenres).includes(input);
}

/**
 * Cria um objeto de uma página a enviar para a Api da Tsuki Mangás (para chamadas POST).
 * @private
 * @param page Classe da páginda.
 * @param coverPath Caminho da cover se houver.
 * @param bannerPath Caminho do banner se houver.
 * @returns Retorna um objeto que vai ser tratado e depois enviado à Api da Tsuki Mangás.
 * @since 0.1.3
 */
function generatePayloadObject(
	page: TmPage,
	coverPath?: string,
	bannerPath?: string
): Record<string, string[] | string | number[] | number> {
	return {
		dex_id: page.ids?.md ?? '',
		mal_id: page.ids?.mal ?? '',
		anilist_id: page.ids?.al ?? '',

		trailer: page.links?.trailer ?? '',

		title: page.titles?.principal ?? '',
		titles_array:
			page.titles && page.titles.alternatives.length
				? page.titles.alternatives
				: [],

		author: page.authors?.join(', ') ?? '',
		artist: page.artists?.join(', ') ?? '',

		format: page.format?.id ?? '',

		demography: page.demographic?.id ?? '',

		adult_content: page.adult ? 1 : 0,
		status: page.status ?? 'Ativo',
		synopsis: page.synopsis ?? '',
		genres_array: page.genres?.length ? page.genres : [],

		// Cover na Tsuki
		poster_path: coverPath ?? '',
		// Banner na Tsuki
		cover_path: bannerPath ?? ''
	};
}

/**
 * Objeto recebido ao chamar a API.
 * @private
 * @since 0.1.0
 */
export type PageReceivedFromApi = {
	id: number;
	url: string;
	title: string;
	status: TmStatuses;
	author: string | null;
	artist: string | null;
	synopsis: string;
	poster: string;
	cover: string;
	format: number;
	demography: number | null;
	adult_content: number;
	trailer: string | null;
	dex_id: number | null;
	anilist_id: number | null;
	mal_id: number | null;
	rating: number | null;
	total_rating: number;
	chapters_count: number;
	views: number;
	views_day: number;
	views_month: number;
	last_published_at: string | null;
	created_at: string | null; // Sim, isto pode ser null
	updated_at: string;
	titles?: Array<{
		title: string;
	}>;
	genres?: Array<{
		genre: string;
	}>;
};

/**
 * Objeto recebido ao chamar a API.
 * @private
 * @since 0.1.3
 */
type SearchReceivedFromApi = {
	data: PageReceivedFromApi[];
};
