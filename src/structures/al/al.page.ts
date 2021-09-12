import { apiRequest, format, formatArray } from '../../utils';
import { TmFormatsType } from '../..';
import {
	AlFormats,
	AlFormatsTypeEn,
	AlDemographics,
	AlDemographicsType,
	AlStatuses,
	AlStatusesTypeEn,
	AlStatusesTypePt,
	AlGenres,
	AlGenresTypeEn,
	AlGenresTypePt,
	AlTags,
	AlTagsTypeEn,
	AlTagsTypePt
} from '../../types/al.types';

/**
 * Classe de interação com obras do AniList.
 * @since 0.1.3
 */
export default class AlPage {
	/**
	 * Objeto de Ids relativos à obra.
	 * @since 0.1.3
	 */
	ids?: {
		/**
		 * Id da obra na AniList.
		 * @since 0.1.3
		 */
		al: number;
		/**
		 * Id da obra no MyAnimeList.
		 * @since 0.1.3
		 */
		mal: number | null;
	};

	/**
	 * Objeto de links relativos à obra.
	 * @since 0.1.3
	 */
	links?: {
		/**
		 * Link completo do trailer da obra no YouTube ou Dailymotion.
		 * Exemplo: https://www.youtube.com/watch?v=PXNQVvQa-FI
		 * @since 0.1.3
		 */
		trailer: { full: string; site: 'youtube' | 'dailymotion' } | null;
		/**
		 * Link completo da página.
		 * Exemplo: https://anilist.co/manga/105398
		 * @since 0.1.3
		 */
		overview: string;
		/**
		 * Link da cover da obra.
		 * A AniList proprõe 3 tamanhos para a cover; o maior possível será escolhido.
		 * Exemplo: https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx105398-b673Vt5ZSuz3.jpg
		 * @since 0.1.3
		 */
		cover: string;
		/**
		 * Link do banner da obra.
		 * Exemplo: https://s4.anilist.co/file/anilistcdn/media/manga/banner/105398-4UrEhdqZukrg.jpg
		 * @since 0.1.3
		 */
		banner: string | null;
	};

	/**
	 * Objeto relativo aos títulos da obra.
	 * @since 0.1.3
	 */
	titles?: {
		/**
		 * Título principal da obra.
		 * @since 0.1.3
		 */
		principal: string;
		/**
		 * Título inglês oficial da obra.
		 * @since 0.1.3
		 */
		english: string | null;
		/**
		 * Título original da obra.
		 * @since 0.1.3
		 */
		native: string | null;
		/**
		 * Títulos alternativos da obra excluindo o principal, inglês e nativo (todos os idiomas incluídos).
		 * @since 0.1.3
		 */
		alternatives: string[];
	};

	/**
	 * Autores da obra.
	 * @since 0.1.3
	 */
	authors?: string[];
	/**
	 * Artistas da obra.
	 * @since 0.1.3
	 */
	artists?: string[];

	/**
	 * Formato da obra.
	 * @since 0.1.3
	 */
	format?: TmFormatsType;

	/**
	 * Demografia da obra.
	 * @since 0.1.3
	 */
	demographic?: {
		id: number;
		label: AlDemographicsType;
	} | null;

	/**
	 * Língua original da obra.
	 * @since 0.1.3
	 */
	language?: 'JP' | 'KR' | 'CN' | null;
	/**
	 * Obra adulta?
	 * @since 0.1.3
	 */
	adult?: boolean;
	/**
	 * Status de publicação da obra.
	 * @since 0.1.3
	 */
	status?: AlStatusesTypePt | null;
	/**
	 * Sinopse da obra.
	 * @since 0.1.3
	 */
	synopsis?: string | null;

	/**
	 * Gêneros da obra.
	 * @since 0.1.3
	 */
	genres?: AlGenresTypePt[];
	/**
	 * Tags da obra.
	 * @since 0.1.3
	 */
	tags?: Array<AlTagsTypePt | 'One-shot'>;

	/**
	 * Número de volumes da obra.
	 * @since 0.1.3
	 */
	volumes?: number | null;
	/**
	 * Número total de capítulos da obra.
	 * @since 0.1.3
	 */
	chapters?: number | null;

	/**
	 * Objeto relativo aos votos da obra.
	 * @since 0.1.3
	 */
	rating?: {
		/**
		 * Média dos votos da obra.
		 * @since 0.1.3
		 */
		average: number | null;
		/**
		 * Popularidade da obra.
		 * @since 0.1.3
		 */
		popularity: number;
	};

	/**
	 * Constructor da classe.
	 * @param data Dados recebidos (objeto) ao chamar a API.
	 * @param beautify Embelezar os dados?
	 * Se sim, todos os dados de utilizador (títulos, gêneros, sinopse, etc.) serão tratados.
	 * @returns Se data for definido, retorna a classe preenchida. Se não, retorna a classe vazia.
	 * @since 0.1.3
	 */
	constructor(received?: ReceivedFromApi, beautify = true) {
		if (!received) return this;

		const data = received.data.Media;

		this.ids = {
			al: data.id,
			mal: data.idMal
		};

		this.links = {
			overview: `https://anilist.co/manga/${data.id}`,
			cover:
				data.coverImage.extraLarge ||
				data.coverImage.large ||
				data.coverImage.medium,
			banner: data.bannerImage || null,
			trailer: data.trailer
				? {
						full:
							data.trailer.site === 'youtube'
								? `https://www.youtube.com/watch?v=${data.trailer.id}`
								: `https://www.dailymotion.com/video/${data.trailer.id}`,
						site: data.trailer.site
				  }
				: null
		};

		this.titles = {
			principal: data.title.english || data.title.romaji,
			english: data.title.english || null,
			native: data.title.native || null,
			alternatives: data.synonyms
		};

		this.authors = [];
		this.artists = [];
		if (data.staff)
			for (const staff of data.staff.edges.values()) {
				if (staff.role.toLowerCase().includes('story'))
					this.authors.push(staff.node.name.full);
				if (staff.role.toLowerCase().includes('art'))
					this.artists.push(staff.node.name.full);
			}

		this.language =
			data.countryOfOrigin === 'JP' ||
			data.countryOfOrigin === 'KR' ||
			data.countryOfOrigin === 'CN'
				? data.countryOfOrigin
				: null;
		this.adult = data.isAdult;
		this.status = AlStatuses[data.status] || null;
		this.synopsis = data.description || null;

		this.genres = [];
		this.tags = [];
		for (const genre of data.genres.values()) this.genres.push(AlGenres[genre]);
		for (const tag of data.tags.values())
			if (inputIsDemographic(tag.name))
				this.demographic = {
					id: tag.id,
					label: tag.name
				};
			else if (inputIsGenre(tag.name)) this.genres.push(AlGenres[tag.name]);
			else if (inputIsTag(tag.id)) this.tags.push(AlTags[tag.id].translated);

		if (data.format === 'ONE_SHOT') this.tags.push('One-shot');
		this.format = AlFormats[data.format];

		if (!this.demographic) this.demographic = null;

		if (this.language === 'JP') this.format = 'Mangá';
		else if (this.language === 'KR') this.format = 'Manhwa';
		else if (this.language === 'CN') this.format = 'Manhua';
		else this.language = null;

		this.volumes = data.volumes;
		this.chapters = data.chapters;

		this.rating = {
			average: data.meanScore,
			popularity: data.popularity
		};

		if (beautify) {
			this.titles.principal = format(this.titles.principal);
			if (this.titles.english)
				this.titles.english = format(this.titles.english);
			if (this.titles.native) this.titles.native = format(this.titles.native);
			this.titles.alternatives = formatArray(
				this.titles.alternatives,
				true,
				false
			);
			this.authors = formatArray(this.authors);
			this.artists = formatArray(this.artists);
			if (this.synopsis) this.synopsis = format(this.synopsis);
		}
	}

	/**
	 * Obter uma obra da AniList.
	 * @param id Id da obra.
	 * @param beautify Embelezar os dados?
	 * Se sim, todos os dados de utilizador (títulos, gêneros, sinopse, etc.) serão tratados.
	 * @returns Retorna esta classe preenchida com as informações da obra.
	 * @since 0.1.3
	 */
	async get(id: number, beautify = true): Promise<AlPage> {
		const query =
				'query ($id: Int) { Media(id: $id, type: MANGA) { id idMal title { romaji english native } synonyms trailer { id site } coverImage { extraLarge large medium } bannerImage staff { edges { node { name { first middle last full native } } role } } format countryOfOrigin isAdult status description genres tags { id name } chapters volumes meanScore popularity } }',
			variables = {
				id
			};

		return new AlPage(
			(await apiRequest('al', '', `obra ${id}`, 'POST', {
				query,
				variables
			})) as ReceivedFromApi,
			beautify
		);
	}
}

/**
 * Verifica se um input é uma demografia (da Tsuki Mangás) válida.
 * @private
 * @param input Possível demografia.
 * @returns Retorna um boolean. Se for true, é porque o 'input' é um válido; se não, é porque não é.
 * @since 0.1.3
 */
function inputIsDemographic(input: string): input is AlDemographicsType {
	return Object.keys(AlDemographics).includes(input);
}

/**
 * Verifica se um input é um gênero (da Tsuki Mangás) válido.
 * @private
 * @param input Possível gênero.
 * @returns Retorna um boolean. Se for true, é porque o 'input' é um válido; se não, é porque não é.
 * @since 0.1.3
 */
function inputIsGenre(input: string): input is AlGenresTypeEn {
	return Object.keys(AlGenres).includes(input);
}

/**
 * Verifica se um input é um gênero (da Tsuki Mangás) válido.
 * Sim, gênero. A Tsuki Mangás não diferencia gêneros e tags.
 * @private
 * @param input Possível gênero.
 * @returns Retorna um boolean. Se for true, é porque o 'input' é um válido; se não, é porque não é.
 * @since 0.1.3
 */
function inputIsTag(input: number): input is keyof typeof AlTags {
	return input in AlTags;
}

/**
 * Objeto recebido ao chamar a API.
 * @private
 * @since 0.1.3
 */
type ReceivedFromApi = {
	data: {
		Media: {
			id: number;
			idMal: number | null;
			title: {
				romaji: string;
				english: string | null;
				native: string | null;
			};
			synonyms: string[];
			trailer: {
				id: string;
				site: 'youtube' | 'dailymotion';
			} | null;
			coverImage: {
				extraLarge: string | null;
				large: string | null;
				medium: string;
			};
			bannerImage: string | null;
			staff: {
				edges: Array<{
					node: {
						name: {
							first: string;
							middle: string | null;
							last: string | null;
							full: string;
							native: string | null;
						};
					};
					role: string;
				}>;
			};
			format: AlFormatsTypeEn;
			countryOfOrigin: 'JP' | 'KR' | 'CN' | string;
			isAdult: boolean;
			status: AlStatusesTypeEn;
			description: string | null;
			genres: AlGenresTypeEn[];
			tags: Array<{
				id: number;
				name: AlTagsTypeEn | AlDemographicsType | string;
			}>;
			chapters: number | null;
			volumes: number | null;
			popularity: number;
			meanScore: number | null;
		};
	};
};
