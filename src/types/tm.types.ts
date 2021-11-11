// ################################################################################ \\
// #                                                                              # \\
// #                                                                              # \\
// #                        Tsuki Mangás - Website typings                        # \\
// #                                                                              # \\
// #                                                                              # \\
// ################################################################################ \\

/**
 * Páginas parciais.
 * @since 0.2.6
 */
export type PartialPage = {
	id: number;
	title: string;
	status: TmStatuses;
	format: {
		id: TmFormatsIdType;
		label: TmFormatsLabelType;
	} | null;
};

/**
 * Status de publicação da Tsuki Mangás.
 * @since 0.1.0
 */
export type TmStatuses = 'Completo' | 'Ativo' | 'Hiato' | 'Cancelado';

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
export type TmFormatsLabelType = keyof typeof TmFormats;
/**
 * Não se pode pegar nos Ids dinamicamente.
 * export type TmFormatsIdType = typeof TmFormats[keyof typeof TmFormats];
 * Esse type permite qualquer número, então tem que ser hard-coded mesmo.
 */
export type TmFormatsIdType = 1 | 2 | 3 | 4;

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
export type TmDemographicsLabelType = keyof typeof TmDemographics;
/**
 * Mesmo motivo do TmFormatsIdType.
 */
export type TmDemographicsIdType = 1 | 2 | 3 | 4;

/**
 * Gêneros oficiais da Tsuki Mangás.
 * Última atualização: 14/08/2021.
 */
export enum TmGenres {
	'4-Koma',
	'Ação',
	'Adaptação',
	'Aliens',
	'Animais',
	'Antologia',
	'Artes Marciais',
	'Aventura',
	'Comédia',
	'Criado pelo Usuário',
	'Crime',
	'Cross-dressing',
	'Deliquentes',
	'Demônios',
	'Doujinshi',
	'Drama',
	'Ecchi',
	'Esportes',
	'Fantasia',
	'Fantasmas',
	'Filosófico',
	'Gals',
	'Ganhador de Prêmio',
	'Garotas Mágicas',
	'Garotas Monstro',
	'Gastronomia',
	'Gore',
	'Harém',
	'Harém Reverso',
	'Hentai',
	'Histórico',
	'Horror',
	'Incesto',
	'Isekai',
	'Jogos Tradicionais',
	'Lolis',
	'Long Strip',
	'Mafia',
	'Magia',
	'Mecha',
	'Medicina',
	'Militar',
	'Mistério',
	'Monstros',
	'Música',
	'Ninjas',
	'Obscenidade',
	'Oficialmente Colorido',
	'One-shot',
	'Policial',
	'Pós-apocalíptico',
	'Psicológico',
	'Realidade Virtual',
	'Reencarnação',
	'Romance',
	'Samurais',
	'Sci-Fi',
	'Shotas',
	'Shoujo Ai',
	'Shounen Ai',
	'Slice of Life',
	'Sobrenatural',
	'Sobrevivência',
	'Super Herói',
	'Thriller',
	'Todo Colorido',
	'Trabalho de Escritório',
	'Tragédia',
	'Troca de Gênero',
	'Vampiros',
	'Viagem no Tempo',
	'Vida Escolar',
	'Vídeo Games',
	'Violência Sexual',
	'Webcomic',
	'Wuxia',
	'Yaoi',
	'Yuri',
	'Zumbis'
}
export type TmGenresType = keyof typeof TmGenres;
