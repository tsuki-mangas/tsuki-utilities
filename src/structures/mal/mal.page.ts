import { apiRequest, format, formatArray } from '../../utils';
import {
	MalDemographics,
	MalFormats,
	MalFormatsTypeEn,
	MalFormatsTypePt,
	MalGenres,
	MalGenresTypeEn,
	MalGenresTypePt,
	MalStatuses,
	MalStatusesTypeEn,
	MalStatusesTypePt
} from '../../types';

/**
 * Classe de interação com uma obra do MyAnimeList.
 * @since 0.1.0
 */
export default class MalPage {
	/**
	 * Id da obra no MyAnimeList.
	 * @since 0.1.0
	 */
	id?: number;

	/**
	 * Objeto de links relativos à obra.
	 * @since 0.1.0
	 */
	links?: {
		/**
		 * Link completo da página.
		 * Exemplo: https://myanimelist.net/manga/37707/Shigatsu_wa_Kimi_no_Uso
		 * @since 0.1.0
		 */
		overview: string;
		/**
		 * Link da cover principal da obra.
		 * Exemplo: https://cdn.myanimelist.net/images/manga/3/102691l.webp
		 * @since 0.1.0
		 */
		cover: string;
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
		 * Título inglês oficial da obra.
		 * @since 0.1.0
		 */
		english: string | null;
		/**
		 * Título original da obra.
		 * @since 0.1.0
		 */
		native: string | null;
		/**
		 * Títulos alternativos da obra excluindo o principal, inglês e nativo (todos os idiomas incluídos).
		 * @since 0.1.0
		 */
		alternatives: string[];
	};

	/**
	 * Autores e artistas da obra.
	 * Por causa de uma limitação, seja do Jikan ou do próprio MyAnimeList, é impossível separar os dois sem web-parsing.
	 * @since 0.1.0
	 */
	staff?: string[];

	/**
	 * Formato da obra.
	 * @since 0.1.0
	 */
	format?: MalFormatsTypePt;

	/**
	 * Demografia da obra.
	 * @since 0.1.0
	 */
	demographic?: {
		id: number;
		// label: valueof<MalDemographics>;
		label: keyof typeof MalDemographics;
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
	status?: MalStatusesTypePt | null;
	/**
	 * Sinopse da obra.
	 * @since 0.1.0
	 */
	synopsis?: string | null;

	/**
	 * Gêneros da obra.
	 * @since 0.1.0
	 */
	genres?: Array<MalGenresTypePt | 'One-shot'>;

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
		/**
		 * Posição global da obra.
		 * @since 0.1.0
		 */
		position: number;
		/**
		 * Popularidade da obra.
		 * @since 0.1.0
		 */
		popularity: number;
	};

	/**
	 * Número de volumes da obra.
	 * @since 0.1.0
	 */
	volumes?: number;
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
	constructor(data?: ReceivedFromApi, beautify = true) {
		if (!data) return this;

		this.id = data.mal_id;

		this.links = {
			overview: data.url,
			cover: data.image_url
		};

		this.titles = {
			principal: data.title,
			english: data.title_english || null,
			native: data.title_japanese || null,
			alternatives: data.title_synonyms.length
				? data.title_synonyms.map(title => title)
				: []
		};

		this.staff = data.authors.map(staffMember => staffMember.name);
		this.staff = this.staff.map(staffMember =>
			staffMember.includes(',')
				? `${staffMember.split(', ')[1]} ${staffMember.split(', ')[0]}`
				: staffMember
		);

		this.status = MalStatuses[data.status] || null;
		this.synopsis = data.synopsis || null;

		function isValidGenre(value: number): value is keyof typeof MalGenres {
			return value in MalGenres;
		}

		this.genres = [];
		for (const genre of data.genres.values())
			if (MalDemographics[genre.mal_id])
				this.demographic = {
					id: genre.mal_id,
					label: MalDemographics[genre.mal_id] as keyof typeof MalDemographics
				};
			else if (isValidGenre(genre.mal_id))
				this.genres.push(MalGenres[genre.mal_id].translated);

		this.adult = this.genres.includes('Hentai');

		switch (data.type) {
			case 'One-shot':
				this.genres.push('One-shot');
				break;
			case 'Doujin':
				this.genres.push('Doujinshi');
				break;
		}
		this.format = MalFormats[data.type];

		this.rating = {
			total: data.scored_by,
			average: data.score,
			position: data.rank,
			popularity: data.popularity
		};

		this.volumes = data.volumes;
		this.chapters = {
			total: data.chapters
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
			this.staff = formatArray(this.staff);
			if (this.synopsis) this.synopsis = format(this.synopsis);
			this.genres = formatArray(this.genres, false, true) as MalPage['genres'];
		}

		return this;
	}

	/**
	 * Obter uma obra do MyAnimeList.
	 * @param id Id da obra.
	 * @returns Retorna esta classe preenchida com as informações da obra.
	 * @since 0.1.0
	 */
	async get(id: number): Promise<MalPage> {
		return new MalPage(
			(await apiRequest(
				'mal',
				`manga/${id}`,
				`obter a obra com Id ${id}`
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
	mal_id: number;
	url: string;
	title: string;
	title_english: string;
	title_synonyms: string[];
	title_japanese: string;
	status: MalStatusesTypeEn;
	image_url: string;
	type: MalFormatsTypeEn;
	volumes: number;
	chapters: number;
	rank: number;
	score: number;
	scored_by: number;
	popularity: number;
	synopsis: string;
	genres: Array<{
		mal_id: number;
		name: MalGenresTypeEn;
	}>;
	authors: Array<{
		name: string;
	}>;
};
