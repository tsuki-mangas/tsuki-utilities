import { apiRequest, format, formatArray } from '../../utils';
import {
	TmDemographics,
	TmFormats,
	TmGenres,
	TmStatuses
} from '../../../types/tm.types';

/**
 * Classe de interação com uma obra da Tsuki Mangás.
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
		id: number;
		label: keyof typeof TmFormats;
	};

	/**
	 * Demografia da obra.
	 * @since 0.1.0
	 */
	demographic?: {
		id: number;
		label: keyof typeof TmDemographics;
	};

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
	genres?: Array<keyof typeof TmGenres>;

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
		average: number;
	};

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
	 * Constructor da classe.
	 * @param data Dados recebidos (objeto) ao chamar a API.
	 * @param beautify Embelezar os dados?
	 * Se sim, todos os dados de utilizador (títulos, gêneros, sinopse, etc.) serão tratados.
	 * Exemplo:
	 *    - 'One Piece' vira 'One Piece'
	 *    - ' One Piece ' vira 'One Piece'
	 * @returns Se data for definido, retorna a classe preenchida. Se não, retorna a classe vazia.
	 * @since 0.1.0
	 */
	constructor(data?: PageReceivedFromApi, beautify = true) {
		if (!data) return this;

		this.ids = {
			tm: data.id,
			md: data.dex_id,
			al: data.anilist_id,
			mal: data.mal_id
		};

		this.links = {
			trailer: data.trailer?.length
				? `https://www.youtube.com/watch?v=${data.trailer}`
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
			principal: data.title,
			alternatives: data.titles?.length
				? data.titles?.map((title) => title.title)
				: []
		};

		this.authors = data.author?.length ? data.author.split(', ') : [];
		this.artists = data.artist?.length ? data.artist.split(', ') : [];

		this.format = {
			id: data.format,
			label: TmFormats[data.format] as keyof typeof TmFormats
		};

		this.demographic = {
			id: data.demography,
			label: TmDemographics[data.demography] as keyof typeof TmDemographics
		};

		this.adult = data.adult_content ? true : false;
		this.status = data.status;
		this.synopsis = data.synopsis?.length ? data.synopsis : null;

		this.genres = [];
		if (data.genres)
			for (const genre of data.genres.values())
				if (Object.keys(TmGenres).includes(genre.genre))
					this.genres.push(genre.genre as keyof typeof TmGenres);

		this.rating = {
			total: data.total_rating,
			average: data.rating
		};

		this.chapters = {
			total: data.chapters_count,
			lastPubishedAt: data.last_published_at
				? new Date(data.last_published_at.replace(/-/g, '/'))
				: null
		};

		this.views = {
			total: data.views,
			today: data.views_day,
			thisMonth: data.views_month
		};

		if (beautify) {
			if (this.links.trailer) this.links.trailer = format(this.links.trailer);
			this.titles.principal = format(this.titles.principal);
			this.titles.alternatives = formatArray(
				this.titles.alternatives,
				true,
				false
			);
			this.authors = formatArray(this.authors, true, false);
			this.artists = formatArray(this.artists, true, false);
			this.genres = formatArray(this.genres) as Array<keyof typeof TmGenres>;
			if (this.synopsis) this.synopsis = format(this.synopsis);
		}

		return this;
	}

	/**
	 * Obter uma obra da Tsuki Mangás.
	 * @param id Id da obra.
	 * @returns Retorna esta classe preenchida com as informações da obra.
	 * @since 0.1.0
	 */
	async get(id: number): Promise<TmPage> {
		return new TmPage(
			(await apiRequest(
				'tm',
				`mangas/${id}`,
				`obter a obra com Id **${id}**`
			)) as PageReceivedFromApi
		);
	}
}

/**
 * Objeto recebido ao chamar a API.
 * @since 0.1.0
 */
type PageReceivedFromApi = {
	id: number;
	url: string;
	title: string;
	status: TmStatuses;
	author: string;
	artist: string;
	synopsis: string;
	poster: string;
	cover: string;
	format: number;
	demography: number;
	adult_content: number;
	trailer: string;
	dex_id: number;
	anilist_id: number;
	mal_id: number;
	rating: number;
	total_rating: number;
	chapters_count: number;
	views: number;
	views_day: number;
	views_month: number;
	last_published_at: string;
	titles?: Array<{
		title: string;
	}>;
	genres?: Array<{
		genre: keyof typeof TmGenres | string;
	}>;
};
