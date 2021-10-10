// ################################################################################ \\
// #                                                                              # \\
// #                                                                              # \\
// #                          AniList - Website typings                           # \\
// #                                                                              # \\
// #                                                                              # \\
// ################################################################################ \\

/**
 * 4/5 status de publicação da AniList.
 * Falta 1 pois ele não tem equivalente na Tsuki Mangás.
 * @since 0.1.3
 */
export const AlStatuses = {
	FINISHED: 'Completo',
	RELEASING: 'Ativo',
	HIATUS: 'Hiato',
	CANCELLED: 'Cancelado'
} as const;
export type AlStatusesTypeEn = keyof typeof AlStatuses;
export type AlStatusesTypePt = typeof AlStatuses[keyof typeof AlStatuses];

/**
 * 3/10 formatos da Anilist.
 * Faltam 7 pois eles não têm equivalente na Tsuki Mangás.
 * @since 0.1.3
 */
export const AlFormats = {
	MANGA: 'Mangá',
	NOVEL: 'Novel',
	ONE_SHOT: 'Mangá'
} as const;
export type AlFormatsTypeEn = keyof typeof AlFormats;

/**
 * As 4 demografias associadas aos respetivos Ids.
 * @since 0.1.3
 */
export enum AlDemographics {
	Seinen = 27,
	Josei = 50,
	Shoujo = 53,
	Shounen = 56
}
export type AlDemographicsLabelType = keyof typeof AlDemographics;
/**
 * Não se pode pegar nos Ids dinamicamente.
 * export type AlDemographicsIdType = typeof AlDemographics[keyof typeof AlDemographics];
 * Esse type permite qualquer número, então tem que ser hard-coded mesmo.
 */
export type AlDemographicsIdType = 27 | 50 | 53 | 56;

/**
 * Gêneros oficiais da AniList.
 * Só estão presentes nesta lista as tags que também tem na Tsuki Mangás.
 * Última atualização: 12/09/2021.
 * @since 0.1.3
 */
export enum AlGenres {
	'Action' = 'Ação',
	'Adventure' = 'Aventura',
	'Comedy' = 'Comédia',
	'Drama' = 'Drama',
	'Ecchi' = 'Ecchi',
	'Fantasy' = 'Fantasia',
	'Hentai' = 'Hentai',
	'Horror' = 'Horror',
	'Mahou Shoujo' = 'Garotas Mágicas',
	'Mecha' = 'Mecha',
	'Music' = 'Música',
	'Mystery' = 'Mistério',
	'Psychological' = 'Psicológico',
	'Romance' = 'Romance',
	'Sci-Fi' = 'Sci-Fi',
	'Slice of Life' = 'Slice of Life',
	'Sports' = 'Esportes',
	'Supernatural' = 'Sobrenatural',
	'Thriller' = 'Thriller'
}
export type AlGenresTypeEn = keyof typeof AlGenres;
export type AlGenresTypePt = typeof AlGenres[keyof typeof AlGenres];

/**
 * Tags oficiais da AniList.
 * Só estão presentes nesta lista as tags que também tem na Tsuki Mangás.
 * Última atualização: 12/09/2021.
 * @since 0.1.3
 */
export const AlTags = {
	15: {
		original: 'Demons',
		translated: 'Demônios'
	},
	23: {
		original: 'Female Harem',
		translated: 'Harém'
	},
	25: {
		original: 'Historical',
		translated: 'Histórico'
	},
	29: {
		original: 'Magic',
		translated: 'Magia'
	},
	30: {
		original: 'Martial Arts',
		translated: 'Artes Marciais'
	},
	34: {
		original: 'Military',
		translated: 'Militar'
	},
	40: {
		original: 'Police',
		translated: 'Policial'
	},
	46: {
		original: 'School',
		translated: 'Vida Escolar'
	},
	74: {
		original: 'Vampire',
		translated: 'Vampiros'
	},
	75: {
		original: "Boys' Love",
		translated: 'Yaoi'
	},
	76: {
		original: 'Yuri',
		translated: 'Yuri'
	},
	77: {
		original: 'Gender Bending',
		translated: 'Troca de Gênero'
	},
	85: {
		original: 'Tragedy',
		translated: 'Tragédia'
	},
	93: {
		original: 'Post-Apocalyptic',
		translated: 'Pós-apocalíptico'
	},
	94: {
		original: 'Gore',
		translated: 'Gore'
	},
	96: {
		original: 'Time Manipulation',
		translated: 'Viagem no Tempo'
	},
	107: {
		original: 'Mafia',
		translated: 'Mafia'
	},
	123: {
		original: 'Male Harem',
		translated: 'Harém Reverso'
	},
	128: {
		original: 'Incest',
		translated: 'Incesto'
	},
	143: {
		original: 'Survival',
		translated: 'Sobrevivência'
	},
	152: {
		original: 'Zombie',
		translated: 'Zumbis'
	},
	186: {
		original: 'Crossdressing',
		translated: 'Cross-dressing'
	},
	172: {
		original: 'Superhero',
		translated: 'Super Herói'
	},
	191: {
		original: 'Aliens',
		translated: 'Aliens'
	},
	206: {
		original: '4-koma',
		translated: '4-koma'
	},
	207: {
		original: 'Full Color',
		translated: 'Todo Colorido'
	},
	220: {
		original: 'Ghost',
		translated: 'Fantasmas'
	},
	243: {
		original: 'Reincarnation',
		translated: 'Reencarnação'
	},
	244: {
		original: 'Isekai',
		translated: 'Isekai'
	},
	255: {
		original: 'Ninja',
		translated: 'Ninjas'
	},
	259: {
		original: 'Monster Girl',
		translated: 'Garotas Mágicas'
	},
	265: {
		original: 'Musical',
		translated: 'Música'
	},
	291: {
		original: 'Samurai',
		translated: 'Samurais'
	},
	303: {
		original: 'Wuxia',
		translated: 'Wuxia'
	},
	308: {
		original: 'Video Games',
		translated: 'Vídeo Games'
	},
	356: {
		original: 'Gyaru',
		translated: 'Gals'
	},
	364: {
		original: 'Augmented Reality',
		translated: 'Realidade Virtual'
	},
	391: {
		original: 'Philosophy',
		translated: 'Filosófico'
	},
	395: {
		original: 'Delinquents',
		translated: 'Deliquentes'
	},
	433: {
		original: 'Animals',
		translated: 'Animais'
	},
	471: {
		original: 'Anthology',
		translated: 'Antologia'
	},
	648: {
		original: 'Crime',
		translated: 'Crime'
	},
	653: {
		original: 'Office Lady',
		translated: 'Trabalho de Escritório'
	},
	659: {
		original: 'Medicine',
		translated: 'Medicina'
	}
} as const;
export type AlTagsTypeEn = typeof AlTags[keyof typeof AlTags]['original'];
export type AlTagsTypePt = typeof AlTags[keyof typeof AlTags]['translated'];
