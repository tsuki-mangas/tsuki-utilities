import { apiRequest, capitalize, format, formatArray } from '../../utils';
import {
	MdStatuses,
	MdStatusesTypeEn,
	MdStatusesTypePt,
	MdContentRating,
	MdDemographics,
	MdGenres,
	MdGenresIdType,
	MdGenresLabelTypeEn,
	MdGenresLabelTypePt,
	MdLanguagesType,
	MdLanguagesTwoLettersType,
	MdRelationshipTypes,
	MdLanguages
} from '../../types/md.types';
import {
	TmFormats,
	TmFormatsIdType,
	TmFormatsLabelType,
	TmDemographics,
	TmDemographicsLabelType,
	TmDemographicsIdType
} from '../../types/tm.types';

/**
 * Classe de interação com obras da MangaDex.
 * @since 0.1.0
 */
export default class MdPage {
	/**
	 * Objeto de Ids relativos à obra.
	 * @since 0.1.0
	 */
	ids?: {
		/**
		 * Uuid da obra na MangaDex.
		 * @since 0.1.0
		 */
		md: string;
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
		 * Link completo da página.
		 * Exemplo: https://mangadex.org/title/4f9eab7d-a2b2-4ee5-9d59-6744f0df4e12
		 * @since 0.1.0
		 */
		overview: string;
		/**
		 * Link da cover principal da obra.
		 * Exemplo: https://uploads.mangadex.org/covers/4f9eab7d-a2b2-4ee5-9d59-6744f0df4e12/7129edad-f454-4b06-aee7-518a17259967.jpg
		 * @since 0.1.0
		 */
		cover: string | null;
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
		label: TmDemographicsLabelType;
	} | null;

	/**
	 * Língua original da obra.
	 * @since 0.1.0
	 */
	language?: MdLanguagesType;
	/**
	 * Obra adulta?
	 * @since 0.1.0
	 */
	adult?: boolean;
	/**
	 * Status de publicação da obra.
	 * @since 0.1.0
	 */
	status?: MdStatusesTypePt | null;
	/**
	 * Sinopse da obra.
	 * @since 0.1.0
	 */
	synopsis?: string | null;

	/**
	 * Gêneros da obra.
	 * @since 0.1.0
	 */
	genres?: Array<MdGenresLabelTypePt | 'Hentai' | 'Ecchi'>;

	/**
	 * Último volume oficial lançado.
	 * @since 0.1.0
	 */
	lastVolume?: string | null;
	/**
	 * Último capítulo oficial lançado.
	 * @since 0.1.0
	 */
	lastChapter?: string | null;

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
	 * @param received Dados recebidos (objeto) ao chamar a API.
	 * @returns Retorna esta classe preenchida.
	 * @since 0.2.1
	 */
	#buildClass(data: PageReceivedFromApi['data']): Required<MdPage> {
		this.ids = {
			md: data.id,
			al: Number(data.attributes.links.al)
				? Number(data.attributes.links.al)
				: null,
			mal: Number(data.attributes.links.mal)
				? Number(data.attributes.links.mal)
				: null
		};

		this.links = {
			overview: `https://mangadex.org/title/${data.id}`,
			cover: data.relationships.find(
				(relationship) => relationship.type === 'cover_art'
			)
				? `https://uploads.mangadex.org/covers/${this.ids.md}/${
						(
							data.relationships.find(
								(relationship) => relationship.type === 'cover_art'
							)?.attributes as {
								fileName: string;
							}
						)?.fileName
				  }`
				: null
		};

		const alternativeTitles = [];
		for (const altTitlesObject of data.attributes.altTitles.values())
			for (const altTitle of Object.values(altTitlesObject))
				if (altTitle.length) alternativeTitles.push(altTitle);

		this.titles = {
			principal: data.attributes.title['en']
				? format(data.attributes.title['en'])
				: format(data.attributes.title[data.attributes.originalLanguage]),
			english: data.attributes.title['en']
				? format(data.attributes.title['en'])
				: null,
			native: data.attributes.title[data.attributes.originalLanguage]
				? format(data.attributes.title[data.attributes.originalLanguage])
				: null,
			alternatives: formatArray(alternativeTitles, true, false)
		};

		if (
			this.titles.principal.toLowerCase() === this.titles.english?.toLowerCase()
		)
			this.titles.english = null;

		this.authors = [];
		this.artists = [];

		for (const author of data.relationships
			.filter((relationship) => relationship.type === 'author')
			.values()) {
			const authorName = (author.attributes as { name: string })?.name;
			if (authorName?.length) this.authors.push(authorName);
		}

		for (const artist of data.relationships
			.filter((relationship) => relationship.type === 'artist')
			.values()) {
			const artistName = (artist.attributes as { name: string })?.name;
			if (artistName?.length) this.artists.push(artistName);
		}

		this.authors = formatArray(this.authors, true, false);
		this.artists = formatArray(this.artists, true, false);

		const originalLanguage = data.attributes.originalLanguage;
		if (originalLanguage === 'ko')
			this.format = { tmId: TmFormats['Manhwa'], label: 'Manhwa' };
		else if (originalLanguage === 'zh' || originalLanguage === 'zh-hk')
			this.format = { tmId: TmFormats['Manhua'], label: 'Manhua' };
		else this.format = { tmId: TmFormats['Mangá'], label: 'Mangá' };

		const demographic = capitalize(
			data.attributes.publicationDemographic
		) as TmDemographicsLabelType;
		this.demographic = {
			tmId: TmDemographics[demographic],
			label: demographic
		};

		this.language = MdLanguages.find(
			(languageObject) =>
				languageObject.twoLetters === data.attributes.originalLanguage
		);
		this.status = MdStatuses[data.attributes.status] || null;
		this.synopsis = data.attributes.description['pt-br']
			? format(data.attributes.description['pt-br'])
			: data.attributes.description['en']
			? format(data.attributes.description['en'])
			: null;

		this.genres = [];
		for (const genre of data.attributes.tags.values())
			if (inputIsGenre(genre.id))
				this.genres.push(MdGenres[genre.id].translated);

		this.adult = false;
		switch (data.attributes.contentRating) {
			case 'pornographic':
				this.genres.push('Hentai');
				this.adult = true;
				break;
			case 'erotica':
				this.genres.push('Ecchi');
		}

		this.lastVolume = data.attributes.lastVolume || null;
		this.lastChapter = data.attributes.lastChapter || null;

		return this as Required<MdPage>;
	}

	/**
	 * Obter uma obra da MangaDex.
	 * @param uuid Uuid da obra.
	 * @returns Retorna esta classe preenchida com as informações da obra.
	 * @since 0.1.0
	 */
	async get(uuid: string): Promise<Required<MdPage>> {
		return this.#buildClass(
			(
				(await apiRequest(
					'md',
					`manga/${uuid}?includes[]=author&includes[]=artist&includes[]=cover_art`,
					`obter a obra com UUID **${uuid}**`
				)) as PageReceivedFromApi
			).data
		);
	}

	/**
	 * Procurar alguma obra na MangaDex.
	 * @param query Input. Texto a procurar.
	 * @returns Array de classes.
	 */
	async search(query: string): Promise<Array<Required<MdPage>>> {
		const request = (await apiRequest(
				'md',
				`manga?title=${query}&includes[]=author&includes[]=artist&includes[]=cover_art`,
				`procurar **${query}**`
			)) as SearchReceivedFromApi,
			results: Array<Required<MdPage>> = [];

		for (const result of request.data.values())
			results.push(this.#buildClass(result));

		return results;
	}
}

/**
 * Verifica se um gênero da MangaDex é válido na Tsuki Mangás.
 * @private
 * @param input Possível gênero.
 * @returns Retorna um boolean. Se for true, é porque o 'input' é um válido; se não, é porque não é.
 * @since 0.1.3
 */
function inputIsGenre(input: string): input is MdGenresIdType {
	return Object.keys(MdGenres).includes(input);
}

/**
 * Objeto recebido ao chamar a API.
 * @since 0.1.0
 */
type PageReceivedFromApi = {
	data: {
		id: string;
		attributes: {
			title: {
				[key in MdLanguagesTwoLettersType]: string;
			};
			altTitles: Array<{ [key in MdLanguagesTwoLettersType]: string }>;
			description: {
				[key in MdLanguagesTwoLettersType]: string;
			};
			links: {
				al: string;
				mal: string;
			};
			originalLanguage: MdLanguagesTwoLettersType;
			lastVolume: string | null;
			lastChapter: string | null;
			publicationDemographic: MdDemographics;
			status: MdStatusesTypeEn;
			year: null;
			contentRating: MdContentRating;
			tags: Array<{
				id: string;
				attributes: {
					name: {
						[key in MdLanguagesTwoLettersType]: MdGenresLabelTypeEn;
					};
				};
			}>;
		};
		relationships: Array<{
			id: string;
			type: MdRelationshipTypes;
			attributes:
				| {
						name: string;
				  }
				| {
						fileName: string;
				  };
		}>;
	};
};

/**
 * Objeto recebido ao chamar a API.
 * @private
 * @since 0.1.3
 */
type SearchReceivedFromApi = {
	data: Array<PageReceivedFromApi['data']>;
};
