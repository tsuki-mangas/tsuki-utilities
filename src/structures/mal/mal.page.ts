import { apiRequest, format, formatArray } from '../../utils';
import MalPageSearch from './mal.page.search';
import {
	TmFormats,
	TmFormatsLabelType,
	TmFormatsIdType,
	TmDemographics,
	TmDemographicsLabelType,
	TmDemographicsIdType
} from '../../types/tm.types';
import {
	MalFormats,
	MalFormatsTypeEn,
	MalDemographics,
	MalDemographicsIdType,
	MalStatuses,
	MalStatusesTypeEn,
	MalStatusesTypePt,
	MalGenres,
	MalGenresTypeEn,
	MalGenresTypePt
} from '../../types/mal.types';

/**
 * Classe de interação com obras do MyAnimeList.
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
	 * Formato da obra equivalente ao da Tsuki Mangás.
	 * @since 0.1.0
	 */
	format?: {
		tmId: TmFormatsIdType;
		label: TmFormatsLabelType;
	} | null;

	/**
	 * Demografia da obra.
	 * @since 0.1.3
	 */
	demographic?: {
		tmId: TmDemographicsIdType;
		malId: MalDemographicsIdType;
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
	 * Número total de capítulos da obra.
	 * @since 0.1.0
	 */
	chapters?: number;

	/**
	 * Constructor da classe.
	 * @since 0.1.0
	 */
	constructor() {
		return this;
	}

	/**
	 * Preenche a classe.
	 * @private
	 * @param data Dados recebidos (objeto) ao chamar a API.
	 * @returns Retorna esta classe preenchida.
	 * @since 0.2.1
	 */
	#buildClass(data: ReceivedFromApi): Required<MalPage> {
		this.id = data.mal_id;

		this.links = {
			overview: data.url,
			cover: data.image_url
		};

		this.titles = {
			principal: format(data.title),
			english: format(data.title_english) || null,
			native: format(data.title_japanese) || null,
			alternatives: data.title_synonyms.length
				? formatArray(
						data.title_synonyms.map((title) => title),
						true,
						false
				  )
				: []
		};

		this.staff = data.authors.map((staffMember) => staffMember.name);
		this.staff = this.staff.map((staffMember) =>
			staffMember.includes(',')
				? `${staffMember.split(', ')[1]} ${staffMember.split(', ')[0]}`
				: staffMember
		);

		this.staff = formatArray(this.staff, true, false);

		this.format = {
			tmId: TmFormats[MalFormats[data.type]],
			label: MalFormats[data.type]
		};

		this.status = MalStatuses[data.status] || null;
		this.synopsis = format(data.synopsis) || null;

		this.genres = [];
		for (const genre of data.genres.values())
			if (inputIsDemographic(genre.mal_id))
				this.demographic = {
					tmId: TmDemographics[
						MalDemographics[genre.mal_id] as TmDemographicsLabelType
					],
					malId: genre.mal_id,
					label: MalDemographics[genre.mal_id] as TmDemographicsLabelType
				};
			else if (inputIsGenre(genre.mal_id))
				this.genres.push(MalGenres[genre.mal_id].translated);

		if (!this.demographic) this.demographic = null;
		this.adult = this.genres.includes('Hentai');

		this.genres = formatArray(this.genres);

		switch (data.type) {
			case 'One-shot':
				this.genres.push('One-shot');
				break;
			case 'Doujin':
				this.genres.push('Doujinshi');
				break;
		}

		this.rating = {
			total: data.scored_by,
			average: data.score,
			position: data.rank,
			popularity: data.popularity
		};

		this.volumes = data.volumes;
		this.chapters = data.chapters;

		return this as Required<MalPage>;
	}

	/**
	 * Obter uma obra do MyAnimeList.
	 * @param id Id da obra.
	 * @returns Retorna esta classe preenchida com as informações da obra.
	 * @since 0.1.0
	 */
	async get(id: number): Promise<Required<MalPage>> {
		return this.#buildClass(
			(await apiRequest(
				'mal',
				`manga/${id}`,
				`obter a obra com Id **${id}**`
			)) as ReceivedFromApi
		);
	}

	/**
	 * Procurar alguma obra no MyAnimeList.
	 * @param query Input. Texto a procurar.
	 * @param limit Limite de resultados.
	 * @returns Retorna uma array de classes parciais.
	 * @since 0.1.3
	 */
	async search(query: string, limit = 5): Promise<MalPageSearch> {
		return new MalPageSearch(query, limit).run();
	}
}

/**
 * Verifica se um input é uma demografia válida.
 * @private
 * @param input Possível demografia.
 * @returns Retorna um boolean. Se for true, é porque o 'input' é um válido; se não, é porque não é.
 * @since 0.1.3
 */
function inputIsDemographic(input: number): input is MalDemographicsIdType {
	return input in MalDemographics;
}

/**
 * Verifica se um gênero é válido na Tsuki Mangás.
 * @private
 * @param input Possível gênero.
 * @returns Retorna um boolean. Se for true, é porque o 'input' é um válido; se não, é porque não é.
 * @since 0.1.3
 */
function inputIsGenre(input: number): input is keyof typeof MalGenres {
	return input in MalGenres;
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
