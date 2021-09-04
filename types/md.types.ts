// ################################################################################ \\
// #                                                                              # \\
// #                                                                              # \\
// #                          MangaDex - Website typings                          # \\
// #                                                                              # \\
// #                                                                              # \\
// ################################################################################ \\

/**
 * Status de publicação da MangaDex.
 * @since 0.1.0
 */
export const MdStatuses = {
	completed: 'Completo',
	ongoing: 'Ativo',
	hiatus: 'Hiato',
	cancelled: 'Cancelado'
} as const;
export type MdStatusesTypeEn = keyof typeof MdStatuses;
export type MdStatusesTypePt = typeof MdStatuses[keyof typeof MdStatuses];

/**
 * As 4 demografias em lower-case (recebido pela API).
 * @since 0.1.0
 */
export type MdDemographics = 'shounen' | 'shoujo' | 'josei' | 'seinen';

/**
 * Rating de conteúdo da MangaDex.
 * @since 0.1.0
 */
export type MdContentRating =
	| 'safe'
	| 'suggestive'
	| 'erotica'
	| 'pornographic';

export type MdRelationshipTypes =
	| 'manga'
	| 'chapter'
	| 'cover_art'
	| 'author'
	| 'artist'
	| 'scanlation_group'
	| 'tag'
	| 'user'
	| 'custom_list';

/**
 * Todas as possíveis línguas da MangaDex.
 * Thanks to Xunder#1586 from MangaDex Discord server.
 * Message link: https://discord.com/channels/403905762268545024/841005104362160168/843099224463376396
 * @since 0.1.0
 */
export const MdLanguages = [
	{ english: 'English', twoLetters: 'en', threeLetters: 'eng' },
	{ english: 'Japanese', twoLetters: 'ja', threeLetters: 'jpn' },
	{ english: 'Polish', twoLetters: 'pl', threeLetters: 'pol' },
	{ english: 'Serbo-Croatian', twoLetters: 'sh', threeLetters: 'hrv' },
	{ english: 'Dutch', twoLetters: 'nl', threeLetters: 'dut' },
	{ english: 'Italian', twoLetters: 'it', threeLetters: 'ita' },
	{ english: 'Russian', twoLetters: 'ru', threeLetters: 'rus' },
	{ english: 'German', twoLetters: 'de', threeLetters: 'ger' },
	{ english: 'Hungarian', twoLetters: 'hu', threeLetters: 'hun' },
	{ english: 'French', twoLetters: 'fr', threeLetters: 'fre' },
	{ english: 'Finnish', twoLetters: 'fi', threeLetters: 'fin' },
	{ english: 'Vietnamese', twoLetters: 'vi', threeLetters: 'vie' },
	{ english: 'Greek', twoLetters: 'el', threeLetters: 'gre' },
	{ english: 'Bulgarian', twoLetters: 'bg', threeLetters: 'bul' },
	{ english: 'Spanish (Es)', twoLetters: 'es', threeLetters: 'spa' },
	{ english: 'Portuguese (Br)', twoLetters: 'pt-br', threeLetters: 'por' },
	{ english: 'Portuguese (Pt)', twoLetters: 'pt', threeLetters: 'por' },
	{ english: 'Swedish', twoLetters: 'sv', threeLetters: 'swe' },
	{ english: 'Arabic', twoLetters: 'ar', threeLetters: 'ara' },
	{ english: 'Danish', twoLetters: 'da', threeLetters: 'dan' },
	{ english: 'Chinese (Simp)', twoLetters: 'zh', threeLetters: 'chi' },
	{ english: 'Bengali', twoLetters: 'bn', threeLetters: 'ben' },
	{ english: 'Romanian', twoLetters: 'ro', threeLetters: 'rum' },
	{ english: 'Czech', twoLetters: 'cs', threeLetters: 'cze' },
	{ english: 'Mongolian', twoLetters: 'mn', threeLetters: 'mon' },
	{ english: 'Turkish', twoLetters: 'tr', threeLetters: 'tur' },
	{ english: 'Indonesian', twoLetters: 'id', threeLetters: 'ind' },
	{ english: 'Korean', twoLetters: 'ko', threeLetters: 'kor' },
	{ english: 'Spanish (LATAM)', twoLetters: 'es-la', threeLetters: 'spa' },
	{ english: 'Persian', twoLetters: 'fa', threeLetters: 'per' },
	{ english: 'Malay', twoLetters: 'ms', threeLetters: 'may' },
	{ english: 'Thai', twoLetters: 'th', threeLetters: 'tha' },
	{ english: 'Catalan', twoLetters: 'ca', threeLetters: 'cat' },
	{ english: 'Filipino', twoLetters: 'tl', threeLetters: 'fil' },
	{ english: 'Chinese (Trad)', twoLetters: 'zh-hk', threeLetters: 'chi' },
	{ english: 'Ukrainian', twoLetters: 'uk', threeLetters: 'ukr' },
	{ english: 'Burmese', twoLetters: 'my', threeLetters: 'bur' },
	{ english: 'Lithuanian', twoLetters: 'lt', threeLetters: 'lit' },
	{ english: 'Hebrew', twoLetters: 'he', threeLetters: 'heb' },
	{ english: 'Hindi', twoLetters: 'hi', threeLetters: 'hin' },
	{ english: 'Norwegian', twoLetters: 'no', threeLetters: 'nor' },
	{ english: 'Other', twoLetters: 'NULL', threeLetters: 'NULL' }
] as const;
export type MdLanguagesType =
	typeof MdLanguages[keyof typeof MdLanguages[keyof typeof MdLanguages]];
export type MdLanguagesTwoLettersType =
	typeof MdLanguages[keyof typeof MdLanguages[keyof typeof MdLanguages]]['twoLetters'];

/**
 * Gênero oficiais da MangaDex.
 * Só estão presentes nesta lista os gêneros que também tem na Tsuki Mangás.
 * Última atualização: 17/08/2021.
 * @since 0.1.0
 */

export const MdGenres = {
	'b11fda93-8f1d-4bef-b2ed-8803d3733170': {
		original: '4-Koma',
		translated: '4-Koma'
	},
	'391b0423-d847-456f-aff0-8b0cfc03066b': {
		original: 'Action',
		translated: 'Ação'
	},
	'f4122d1c-3b44-44d0-9936-ff7502c39ad3': {
		original: 'Adaptation',
		translated: 'Adaptação'
	},
	'87cc87cd-a395-47af-b27a-93258283bbc6': {
		original: 'Adventure',
		translated: 'Aventura'
	},
	'e64f6742-c834-471d-8d72-dd51fc02b835': {
		original: 'Aliens',
		translated: 'Aliens'
	},
	'3de8c75d-8ee3-48ff-98ee-e20a65c86451': {
		original: 'Animals',
		translated: 'Animais'
	},
	'51d83883-4103-437c-b4b1-731cb73d786c': {
		original: 'Anthology',
		translated: 'Antologia'
	},
	'0a39b5a1-b235-4886-a747-1d05d216532d': {
		original: 'Award Winning',
		translated: 'Ganhador de Prêmio'
	},
	'5920b825-4181-4a17-beeb-9918b0ff7a30': {
		original: "Boys' Love",
		translated: 'Shounen Ai'
	},
	'4d32cc48-9f00-4cca-9b5a-a839f0764984': {
		original: 'Comedy',
		translated: 'Comédia'
	},
	// 'ea2bc92d-1c26-4930-9b7c-d5c0dc1b6869': {
	// 	original: 'Cooking',
	// 	translated: ''
	// },
	'5ca48985-9a9d-4bd8-be29-80dc0303db72': {
		original: 'Crime',
		translated: 'Crime'
	},
	'9ab53f92-3eed-4e9b-903a-917c86035ee3': {
		original: 'Crossdressing',
		translated: 'Cross-dressing'
	},
	'da2d50ca-3018-4cc0-ac7a-6b7d472a29ea': {
		original: 'Delinquents',
		translated: 'Deliquentes'
	},
	'39730448-9a5f-48a2-85b0-a70db87b1233': {
		original: 'Demons',
		translated: 'Demônios'
	},
	'b13b2a48-c720-44a9-9c77-39c9979373fb': {
		original: 'Doujinshi',
		translated: 'Doujinshi'
	},
	'b9af3a63-f058-46de-a9a0-e0c13906197a': {
		original: 'Drama',
		translated: 'Drama'
	},
	// '7b2ce280-79ef-4c09-9b58-12b7c23a9b78': {
	// 	original: 'Fan Colored',
	// 	translated: ''
	// },
	'cdc58593-87dd-415e-bbc0-2ec27bf404cc': {
		original: 'Fantasy',
		translated: 'Fantasia'
	},
	'f5ba408b-0e7a-484d-8d49-4e9125ac96de': {
		original: 'Full Color',
		translated: 'Todo Colorido'
	},
	'2bd2e8d0-f146-434a-9b51-fc9ff2c5fe6a': {
		original: 'Genderswap',
		translated: 'Troca de Gênero'
	},
	'3bb26d85-09d5-4d2e-880c-c34b974339e9': {
		original: 'Ghosts',
		translated: 'Fantasmas'
	},
	'a3c67850-4684-404e-9b7f-c69850ee5da6': {
		original: "Girls' Love",
		translated: 'Shoujo Ai'
	},
	'b29d6a3d-1569-4e7a-8caf-7557bc92cd5d': {
		original: 'Gore',
		translated: 'Gore'
	},
	'fad12b5e-68ba-460e-b933-9ae8318f5b65': {
		original: 'Gyaru',
		translated: 'Gals'
	},
	'aafb99c1-7f60-43fa-b75f-fc9502ce29c7': {
		original: 'Harem',
		translated: 'Harém'
	},
	'33771934-028e-4cb3-8744-691e866a923e': {
		original: 'Historical',
		translated: 'Histórico'
	},
	'cdad7e68-1419-41dd-bdce-27753074a640': {
		original: 'Horror',
		translated: 'Horror'
	},
	'5bd0e105-4481-44ca-b6e7-7544da56b1a3': {
		original: 'Incest',
		translated: 'Incesto'
	},
	'ace04997-f6bd-436e-b261-779182193d3d': {
		original: 'Isekai',
		translated: 'Isekai'
	},
	'2d1f5d56-a1e5-4d0d-a961-2193588b08ec': {
		original: 'Loli',
		translated: 'Lolis'
	},
	'3e2b8dae-350e-4ab8-a8ce-016e844b9f0d': {
		original: 'Long Strip',
		translated: 'Long Strip'
	},
	'85daba54-a71c-4554-8a28-9901a8b0afad': {
		original: 'Mafia',
		translated: 'Mafia'
	},
	'a1f53773-c69a-4ce5-8cab-fffcd90b1565': {
		original: 'Magic',
		translated: 'Magia'
	},
	'81c836c9-914a-4eca-981a-560dad663e73': {
		original: 'Magical Girls',
		translated: 'Garotas Mágicas'
	},
	'799c202e-7daa-44eb-9cf7-8a3c0441531e': {
		original: 'Martial Arts',
		translated: 'Artes Marciais'
	},
	'50880a9d-5440-4732-9afb-8f457127e836': {
		original: 'Mecha',
		translated: 'Mecha'
	},
	'c8cbe35b-1b2b-4a3f-9c37-db84c4514856': {
		original: 'Medical',
		translated: 'Medicina'
	},
	'ac72833b-c4e9-4878-b9db-6c8a4a99444a': {
		original: 'Military',
		translated: 'Militar'
	},
	'dd1f77c5-dea9-4e2b-97ae-224af09caf99': {
		original: 'Monster Girls',
		translated: 'Garotas Monstro'
	},
	'36fd93ea-e8b8-445e-b836-358f02b3d33d': {
		original: 'Monsters',
		translated: 'Monstros'
	},
	'f42fbf9e-188a-447b-9fdc-f19dc1e4d685': {
		original: 'Music',
		translated: 'Música'
	},
	'ee968100-4191-4968-93d3-f82d72be7e46': {
		original: 'Mystery',
		translated: 'Mistério'
	},
	'489dd859-9b61-4c37-af75-5b18e88daafc': {
		original: 'Ninja',
		translated: 'Ninjas'
	},
	'92d6d951-ca5e-429c-ac78-451071cbf064': {
		original: 'Office Workers',
		translated: 'Trabalho de Escritório'
	},
	'320831a8-4026-470b-94f6-8353740e6f04': {
		original: 'Official Colored',
		translated: 'Oficialmente Colorido'
	},
	'0234a31e-a729-4e28-9d6a-3f87c4966b9e': {
		original: 'Oneshot',
		translated: 'One-shot'
	},
	'b1e97889-25b4-4258-b28b-cd7f4d28ea9b': {
		original: 'Philosophical',
		translated: 'Filosófico'
	},
	'df33b754-73a3-4c54-80e6-1a74a8058539': {
		original: 'Police',
		translated: 'Policial'
	},
	'9467335a-1b83-4497-9231-765337a00b96': {
		original: 'Post-Apocalyptic',
		translated: 'Pós-apocalíptico'
	},
	'3b60b75c-a2d7-4860-ab56-05f391bb889c': {
		original: 'Psychological',
		translated: 'Psicológico'
	},
	'0bc90acb-ccc1-44ca-a34a-b9f3a73259d0': {
		original: 'Reincarnation',
		translated: 'Reencarnação'
	},
	'65761a2a-415e-47f3-bef2-a9dababba7a6': {
		original: 'Reverse Harem',
		translated: 'Harém Reverso'
	},
	'423e2eae-a7a2-4a8b-ac03-a8351462d71d': {
		original: 'Romance',
		translated: 'Romance'
	},
	'81183756-1453-4c81-aa9e-f6e1b63be016': {
		original: 'Samurai',
		translated: 'Samurais'
	},
	'caaa44eb-cd40-4177-b930-79d3ef2afe87': {
		original: 'School Life',
		translated: 'Vida Escolar'
	},
	'256c8bd9-4904-4360-bf4f-508a76d67183': {
		original: 'Sci-Fi',
		translated: 'Sci-Fi'
	},
	'97893a4c-12af-4dac-b6be-0dffb353568e': {
		original: 'Sexual Violence',
		translated: 'Violência Sexual'
	},
	'ddefd648-5140-4e5f-ba18-4eca4071d19b': {
		original: 'Shota',
		translated: 'Shotas'
	},
	'e5301a23-ebd9-49dd-a0cb-2add944c7fe9': {
		original: 'Slice of Life',
		translated: 'Slice of Life'
	},
	'69964a64-2f90-4d33-beeb-f3ed2875eb4c': {
		original: 'Sports',
		translated: 'Esportes'
	},
	'7064a261-a137-4d3a-8848-2d385de3a99c': {
		original: 'Superhero',
		translated: 'Super Herói'
	},
	'eabc5b4c-6aff-42f3-b657-3e90cbd00b75': {
		original: 'Supernatural',
		translated: 'Sobrenatural'
	},
	'5fff9cde-849c-4d78-aab0-0d52b2ee1d25': {
		original: 'Survival',
		translated: 'Sobrevivência'
	},
	'07251805-a27e-4d59-b488-f0bfbec15168': {
		original: 'Thriller',
		translated: 'Thriller'
	},
	'292e862b-2d17-4062-90a2-0356caa4ae27': {
		original: 'Time Travel',
		translated: 'Viagem no Tempo'
	},
	'31932a7e-5b8e-49a6-9f12-2afa39dc544c': {
		original: 'Traditional Games',
		translated: 'Jogos Tradicionais'
	},
	'f8f62932-27da-4fe4-8ee1-6779a8c5edba': {
		original: 'Tragedy',
		translated: 'Tragédia'
	},
	'891cf039-b895-47f0-9229-bef4c96eccd4': {
		original: 'User Created',
		translated: 'Criado pelo Usuário'
	},
	'd7d1730f-6eb0-4ba6-9437-602cac38664c': {
		original: 'Vampires',
		translated: 'Vampiros'
	},
	'9438db5a-7e2a-4ac0-b39e-e0d95a34b8a8': {
		original: 'Video Games',
		translated: 'Vídeo Games'
	},
	// 'd14322ac-4d6f-4e9b-afd9-629d5f4d8a41': {
	// 	original: 'Villainess',
	// 	translated: ''
	// },
	'8c86611e-fab7-4986-9dec-d1a2f44acdd5': {
		original: 'Virtual Reality',
		translated: 'Realidade Virtual'
	},
	'e197df38-d0e7-43b5-9b09-2842d0c326dd': {
		original: 'Web Comic',
		translated: 'Webcomic'
	},
	'acc803a4-c95a-4c22-86fc-eb6b582d82a2': {
		original: 'Wuxia',
		translated: 'Wuxia'
	},
	'631ef465-9aba-4afb-b0fc-ea10efe274a8': {
		original: 'Zombies',
		translated: 'Zumbis'
	}
} as const;
export type MdGenresTypeEn = typeof MdGenres[keyof typeof MdGenres]['original'];
export type MdGenresTypePt =
	typeof MdGenres[keyof typeof MdGenres]['translated'];
