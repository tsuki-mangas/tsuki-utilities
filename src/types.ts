export type AvailableWebsites =
	| 'Tsuki Mangás'
	| 'MangaDex'
	| 'AniList'
	| 'MyAnimeList';
export type AvailableWebsitesShort = 'tm' | 'md' | 'al' | 'mal';

// ############################################################################################################################################ \\
// #                                                                                                                                          # \\
// #                                                                                                                                          # \\
// #                                                      Tsuki Mangás - Website typings                                                      # \\
// #                                                                                                                                          # \\
// #                                                                                                                                          # \\
// ############################################################################################################################################ \\

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

// -------------------- \\

export type TmStatuses = 'Ativo' | 'Completo' | 'Cancelado' | 'Hiato';

// -------------------- \\

export enum TmFormats {
	'Mangá' = 1,
	'Manhwa',
	'Manhua',
	'Novel'
}

// -------------------- \\

export enum TmDemographics {
	'Shounen' = 1,
	'Shoujo',
	'Seinen',
	'Josei'
}
