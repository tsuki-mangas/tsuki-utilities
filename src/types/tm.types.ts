// ################################################################################ \\
// #                                                                              # \\
// #                                                                              # \\
// #                        Tsuki Mangás - Website typings                        # \\
// #                                                                              # \\
// #                                                                              # \\
// ################################################################################ \\

/**
 * Status de publicação da Tsuki Mangás.
 * @since 0.1.0
 */
export type TmStatuses = 'Ativo' | 'Completo' | 'Cancelado' | 'Hiato';

/**
 * Todos os formatos da Tsuki Mangás associados aos respetivos Ids.
 * @since 0.1.0
 */
export enum TmFormats {
	'Mangá' = 1,
	'Manhwa',
	'Manhua',
	'Novel'
}

/**
 * As 4 demografias associadas aos respetivos Ids.
 * @since 0.1.0
 */
export enum TmDemographics {
	'Shounen' = 1,
	'Shoujo',
	'Seinen',
	'Josei'
}

/**
 * Gênero oficiais da Tsuki Mangás.
 * Última atualização: 14/08/2021.
 */
export enum TmGenres {
	'4-Koma',
	'Ação',
	'Aventura',
	'Ganhador de Prêmio',
	'Comédia',
	'Gastronomia',
	'Doujinshi',
	'Drama',
	'Ecchi',
	'Fantasia',
	'Gals',
	'Harém',
	'Histórico',
	'Horror',
	'Artes Marciais',
	'Mecha',
	'Medicina',
	'Música',
	'Mistério',
	'One-shot',
	'Psicológico',
	'Romance',
	'Vida Escolar',
	'Sci-Fi',
	'Shoujo Ai',
	'Shounen Ai',
	'Slice of Life',
	'Obscenidade',
	'Esportes',
	'Sobrenatural',
	'Tragédia',
	'Long Strip',
	'Yaoi',
	'Yuri',
	'Vídeo Games',
	'Isekai',
	'Adaptação',
	'Antologia',
	'Webcomic',
	'Todo Colorido',
	'Criado pelo Usuário',
	'Oficialmente Colorido',
	'Gore',
	'Violência Sexual',
	'Crime',
	'Garotas Mágicas',
	'Filosófico',
	'Super Herói',
	'Thriller',
	'Wuxia',
	'Aliens',
	'Animais',
	'Cross-dressing',
	'Demônios',
	'Deliquentes',
	'Troca de Gênero',
	'Fantasmas',
	'Garotas Monstro',
	'Lolis',
	'Magia',
	'Militar',
	'Monstros',
	'Ninjas',
	'Trabalho de Escritório',
	'Policial',
	'Pós-apocalíptico',
	'Reencarnação',
	'Harém Reverso',
	'Samurais',
	'Shotas',
	'Sobrevivência',
	'Viagem no Tempo',
	'Vampiros',
	'Jogos Tradicionais',
	'Realidade Virtual',
	'Zumbis',
	'Incesto',
	'Mafia',
	'Hentai'
}
