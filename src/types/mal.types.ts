// ################################################################################ \\
// #                                                                              # \\
// #                                                                              # \\
// #                        MyAnimeList - Website typings                         # \\
// #                                                                              # \\
// #                                                                              # \\
// ################################################################################ \\

/**
 * 3/7 status de publicação do MyAnimeList.
 * Faltam 4 pois eles não tem equivalente na Tsuki Mangás.
 * @since 0.1.0
 */
export const MalStatuses = {
	Finished: 'Completo',
	Complete: 'Completo',
	Publishing: 'Ativo'
} as const;
export type MalStatusesTypeEn = keyof typeof MalStatuses;
export type MalStatusesTypePt = typeof MalStatuses[keyof typeof MalStatuses];

/**
 * Todos os formatos do MyAnimeList.
 * Os formatos 'One-shot' e 'Doujin' são transformados no formato 'Mangá'.
 * @since 0.1.0
 */
export const MalFormats = {
	Manga: 'Mangá',
	Manhwa: 'Manhwa',
	Manhua: 'Manhua',
	'Light Novel': 'Novel',
	// ----- \\
	'One-shot': 'Mangá',
	Doujin: 'Mangá'
} as const;
export type MalFormatsTypeEn = keyof typeof MalFormats;
export type MalFormatsTypePt = typeof MalFormats[keyof typeof MalFormats];

/**
 * As 4 demografias associadas aos respetivos Ids.
 * @since 0.1.0
 */
export enum MalDemographics {
	'Shoujo' = 25,
	'Shounen' = 27,
	'Seinen' = 41,
	'Josei' = 42
}

/**
 * Gênero oficiais do MyAnimeList.
 * Só estão presentes nesta lista os gêneros que também tem na Tsuki Mangás.
 * Última atualização: 14/08/2021.
 * @since 0.1.0
 */
export const MalGenres = {
	1: {
		original: 'Action',
		translated: 'Ação'
	},
	2: {
		original: 'Adventure',
		translated: 'Aventura'
	},
	// 3: {
	// 	original: 'Cars',
	// 	translated: '',
	// },
	4: {
		original: 'Comedy',
		translated: 'Comédia'
	},
	5: {
		original: 'Dementia',
		translated: 'Comédia'
	},
	6: {
		original: 'Demons',
		translated: 'Demônios'
	},
	7: {
		original: 'Mystery',
		translated: 'Mistério'
	},
	8: {
		original: 'Drama',
		translated: 'Drama'
	},
	9: {
		original: 'Ecchi',
		translated: 'Ecchi'
	},
	10: {
		original: 'Fantasy',
		translated: 'Fantasia'
	},
	11: {
		original: 'Game',
		translated: 'Vídeo Games'
	},
	12: {
		original: 'Hentai',
		translated: 'Hentai'
	},
	13: {
		original: 'Historical',
		translated: 'Histórico'
	},
	14: {
		original: 'Horror',
		translated: 'Horror'
	},
	// 15: {
	// 	original: 'Kids',
	// 	translated: ''
	// },
	16: {
		original: 'Magic',
		translated: 'Magia'
	},
	17: {
		original: 'Martial Arts',
		translated: 'Artes Marciais'
	},
	18: {
		original: 'Mecha',
		translated: 'Mecha'
	},
	19: {
		original: 'Music',
		translated: 'Música'
	},
	// 20: {
	// 	original: 'Parody',
	// 	translated: '',
	// },
	21: {
		original: 'Samurai',
		translated: 'Samurais'
	},
	22: {
		original: 'Romance',
		translated: 'Romance'
	},
	23: {
		original: 'School',
		translated: 'Vida Escolar'
	},
	24: {
		original: 'Sci Fi',
		translated: 'Sci-Fi'
	},
	// 25: {
	// 	original: 'Shoujo',
	// 	translated: '',
	// },
	26: {
		original: 'Shoujo Ai',
		translated: 'Shoujo Ai'
	},
	// 27: {
	// 	original: 'Shounen',
	// 	translated: '',
	// },
	28: {
		original: 'Shounen Ai',
		translated: 'Shounen Ai'
	},
	// 29: {
	// 	original: 'Space',
	// 	translated: '',
	// },
	30: {
		original: 'Sports',
		translated: 'Esportes'
	},
	// 31: {
	// 	original: 'Super Power',
	// 	translated: '',
	// },
	32: {
		original: 'Vampire',
		translated: 'Vampiros'
	},
	33: {
		original: 'Yaoi',
		translated: 'Yaoi'
	},
	34: {
		original: 'Yuri',
		translated: 'Yuri'
	},
	35: {
		original: 'Harem',
		translated: 'Harém'
	},
	36: {
		original: 'Slice Of Life',
		translated: 'Slice of Life'
	},
	37: {
		original: 'Supernatural',
		translated: 'Sobrenatural'
	},
	38: {
		original: 'Military',
		translated: 'Militar'
	},
	39: {
		original: 'Police',
		translated: 'Policial'
	},
	40: {
		original: 'Psychological',
		translated: 'Psicológico'
	},
	// 41: {
	// 	original: 'Seinen',
	// 	translated: '',
	// },
	// 42: {
	// 	original: 'Josei',
	// 	translated: '',
	// },
	43: {
		original: 'Doujinshi',
		translated: 'Doujinshi'
	},
	// 44: {
	// 	original: 'Gender Bender',
	// 	translated: '',
	// },
	45: {
		original: 'Thriller',
		translated: 'Thriller'
	}
} as const;
export type MalGenresTypeEn =
	typeof MalGenres[keyof typeof MalGenres]['original'];
export type MalGenresTypePt =
	typeof MalGenres[keyof typeof MalGenres]['translated'];
