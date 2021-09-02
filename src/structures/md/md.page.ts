import { apiRequest, capitalize, format, formatArray } from '../../utils';
import {
	MdStatuses,
	MdStatusesTypeEn,
	MdStatusesTypePt,
	MdContentRating,
	MdDemographics,
	MdGenres,
	MdGenresTypeEn,
	MdGenresTypePt,
	MdLanguagesType,
	MdLanguagesTwoLettersType,
	MdRelationshipTypes,
	MdLanguages
} from '../../types/md.types';
import { TmDemographics, TmFormats } from '../../types/tm.types';

/**
 * Classe de interação com uma obra da MangaDex.
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
	 * Formato da obra.
	 * @since 0.1.0
	 */
	format?: keyof typeof TmFormats;

	/**
	 * Demografia da obra.
	 * @since 0.1.0
	 */
	demographic?: keyof typeof TmDemographics | null;

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
	genres?: Array<MdGenresTypePt | 'Hentai' | 'Ecchi'>;

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
	 * @param data Dados recebidos (objeto) ao chamar a API.
	 * @param beautify Embelezar os dados?
	 * Se sim, todos os dados de utilizador (títulos, gêneros, sinopse, etc.) serão tratados.
	 * Exemplo:
	 *    - 'One Piece' vira 'One Piece'
	 *    - ' One Piece ' vira 'One Piece'
	 * @returns Se data for definido, retorna a classe preenchida. Se não, retorna a classe vazia.
	 * @since 0.1.0
	 */
	constructor(received?: ReceivedFromApi, beautify = true) {
		if (!received) return this;

		const { data, relationships } = received;

		this.ids = {
			md: received.data.id,
			al: Number(data.attributes.links.al)
				? Number(data.attributes.links.al)
				: null,
			mal: Number(data.attributes.links.mal)
				? Number(data.attributes.links.mal)
				: null
		};

		this.links = {
			overview: `https://mangadex.org/title/${data.id}`,
			cover: relationships.find(
				relationship => relationship.type === 'cover_art'
			)
				? `https://uploads.mangadex.org/covers/${this.ids.md}/${
						(relationships.find(
							relationship => relationship.type === 'cover_art'
						)?.attributes as { fileName: string })?.fileName
				  }`
				: null
		};

		const alternativeTitles = [];
		for (const altTitlesObject of data.attributes.altTitles.values())
			for (const altTitle of Object.values(altTitlesObject))
				if (altTitle.length) alternativeTitles.push(altTitle);

		this.titles = {
			principal: data.attributes.title['en']
				? data.attributes.title['en']
				: data.attributes.title[data.attributes.originalLanguage],
			english: data.attributes.title['en'] ? data.attributes.title['en'] : null,
			native: data.attributes.title[data.attributes.originalLanguage]
				? data.attributes.title[data.attributes.originalLanguage]
				: null,
			alternatives: alternativeTitles
		};

		if (this.titles.principal === this.titles.english)
			this.titles.english.toLowerCase();

		this.authors = [];
		this.artists = [];

		for (const author of relationships
			.filter(relationship => relationship.type === 'author')
			.values()) {
			const authorName = (author.attributes as { name: string }).name;
			if (authorName.length) this.authors.push(authorName);
		}

		for (const artist of relationships
			.filter(relationship => relationship.type === 'artist')
			.values()) {
			const artistName = (artist.attributes as { name: string }).name;
			if (artistName.length) this.artists.push(artistName);
		}

		switch (data.attributes.originalLanguage) {
			case 'ko':
				this.format = 'Manhwa';
				break;
			case 'zh':
			case 'zh-hk':
				this.format = 'Manhua';
				break;
			default:
				this.format = 'Mangá';
		}

		this.demographic = capitalize(
			data.attributes.publicationDemographic
		) as this['demographic'];

		this.language = MdLanguages.find(
			languageObject =>
				languageObject.twoLetters === data.attributes.originalLanguage
		);
		this.status = MdStatuses[data.attributes.status] || null;
		this.synopsis =
			data.attributes.description['pt-br'] ||
			data.attributes.description['en'] ||
			null;

		function isValidGenre(value: string): value is keyof typeof MdGenres {
			return value in MdGenres;
		}

		this.genres = [];
		for (const genre of data.attributes.tags.values())
			if (isValidGenre(genre.id))
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

		this.lastVolume = data.attributes.lastVolume;
		this.lastChapter = data.attributes.lastChapter;

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
			this.authors = formatArray(this.authors, true, false);
			this.artists = formatArray(this.artists, true, false);
			if (this.synopsis) this.synopsis = format(this.synopsis);
		}

		return this;
	}

	/**
	 * Obter uma obra da MangaDex.
	 * @param uuid Uuid da obra.
	 * @returns Retorna esta classe preenchida com as informações da obra.
	 * @since 0.1.0
	 */
	async get(uuid: string): Promise<MdPage> {
		return new MdPage(
			(await apiRequest(
				'md',
				`manga/${uuid}?includes[]=author&includes[]=artist&includes[]=cover_art`,
				`obter a obra com Uuid **${uuid}**`
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
						[key in MdLanguagesTwoLettersType]: MdGenresTypeEn;
					};
				};
			}>;
		};
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
