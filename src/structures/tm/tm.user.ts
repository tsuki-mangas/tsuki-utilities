import { apiRequest, format } from '../../utils';
import ArgumentError from '../argument.error';

/**
 * Classe de interação com um usuário da Tsuki Mangás.
 * @since 0.1.0
 */
export default class TmUser {
	/**
	 * Id do usuário.
	 * @since 0.1.0
	 */
	id?: number;
	/**
	 * Nome de usuário.
	 * @since 0.1.0
	 */
	username?: string;

	/**
	 * Objeto de links relativos ao usuário.
	 * @since 0.1.0
	 */
	links?: {
		/**
		 * Link completo do perfil do usuário.
		 * Exemplo: https://tsukimangas.com/perfil/luf
		 * @since 0.1.0
		 */
		profile: string;
		/**
		 * Link do avatar do usuário.
		 * Exemplo: https://tsukimangas.com/avatar/5.jpg?t=1628557106952
		 * @since 0.1.0
		 */
		avatar: string;
		/**
		 * Link do banner do usuário.
		 * Exemplo: https://tsukimangas.com/capa/5.jpg?t=1628555914715
		 * @since 0.1.0
		 */
		banner: string;
	};

	/**
	 * Usuário Prime?
	 * @since 0.1.0
	 */
	vip?: boolean;
	/**
	 * Nível de permissão do usuário.
	 * - 0 = Usuário
	 * - 1 = Membro de scan
	 * - 2 = Staff
	 * - 3 = Administrador
	 * @since 0.1.0
	 */
	permission?: ReceivedFromApi['permission'];
	/**
	 * Usuário banido?
	 * @since 0.1.0
	 */
	banned?: boolean;

	/**
	 * Nome do usuário.
	 * @since 0.1.0
	 */
	name?: string | null;
	/**
	 * Sobre o usuário.
	 * @since 0.1.0
	 */
	about?: string | null;
	/**
	 * Cidade do usuário.
	 * @since 0.1.0
	 */
	city?: string | null;
	/**
	 * Data de nascimento do usuário.
	 * @since 0.1.0
	 */
	birthday?: Date | null;

	/**
	 * Objeto relativo ao gênero do usuário.
	 * @since 0.1.0
	 */
	gender?: {
		/**
		 * Id do gênero.
		 * - 0 = Feminino
		 * - 1 = Masculino
		 * @since 0.1.0
		 */
		id: 0 | 1;
		/**
		 * Gênero do usuário.
		 * @since 0.1.0
		 */
		label: 'Masculino' | 'Feminino';
	} | null;

	/**
	 * Mostrar obras adultas?
	 * @since 0.1.0
	 */
	showAdultContent?: boolean;
	/**
	 * Ver trailers?
	 * @since 0.1.0
	 */
	playTrailers?: boolean;

	/**
	 * Pontos de experiência do usuário.
	 * @since 0.1.0
	 */
	experience?: number;
	/**
	 * Nivel do usuário.
	 * @since 0.1.0
	 */
	level?: number;
	/**
	 * Pontos do usuário.
	 * @since 0.1.0
	 */
	points?: number;

	/**
	 * Constructor da classe.
	 * @param data Dados recebidos (objeto) ao chamar a API.
	 * @since 0.1.0
	 */
	constructor(data?: ReceivedFromApi) {
		if (data) this.#buildClass(data);

		return this;
	}

	/**
	 * Preenche a classe.
	 * @private
	 * @param data Dados recebidos (objeto) ao chamar a API.
	 * @returns Retorna esta classe preenchida.
	 * @since 0.2.1
	 */
	#buildClass(data: ReceivedFromApi): Required<TmUser> {
		this.id = data.id;
		this.username = data.username;

		this.links = {
			profile: `https://tsukimangas.com/perfil/${this.username}`,
			avatar: `https://tsukimangas.com/avatar/${data.avatar}`,
			banner: `https://tsukimangas.com/capa/${data.cover}`
		};

		this.vip = data.vip ? true : false;
		this.permission = data.permission;
		this.banned = data.banned ? true : false;

		this.name = data.name ? format(data.name) : null;
		this.about = data.about ? format(data.about) : null;
		this.city = data.city ? format(data.city) : null;
		this.birthday = data.birthday
			? new Date(data.birthday.replace(/-/g, '/'))
			: null;

		/**
		 * Id: 0 = Feminino
		 * Id: 1 = Masculino
		 */
		this.gender = {
			id: data.gender,
			label: data.gender === 1 ? 'Masculino' : 'Feminino'
		};

		this.showAdultContent = data.show_adult_content ? true : false;
		// Eu sei, isto não faz sentido. É culpa da API mesmo, não minha.
		this.playTrailers = data.show_trailers === 0 ? true : false;

		this.experience = data.experience;
		this.level = data.level;
		this.points = data.points;

		return this as Required<TmUser>;
	}

	/**
	 * Obter uma usuário da Tsuki Mangás por nome de usuário.
	 * @param username Nome de usuário.
	 * @returns Retorna esta classe preenchida com as informações do usuário.
	 * @since 0.1.0
	 */
	async getByUsername(username: string): Promise<Required<TmUser>> {
		return this.#buildClass(
			(await apiRequest(
				'tm',
				`users/${username}`,
				`obter o usuário **${username}**`
			)) as ReceivedFromApi
		);
	}

	/**
	 * Obter uma usuário da Tsuki Mangás por Id.
	 * @param username Id do usuário.
	 * @returns Retorna esta classe preenchida com as informações do usuário.
	 * @since 0.2.4
	 */
	async getById(id: number): Promise<Required<TmUser>> {
		return this.#buildClass(
			(await apiRequest(
				'tm',
				`users/id/${id}`,
				`obter o usuário com Id **${id}**`
			)) as ReceivedFromApi
		);
	}

	/**
	 * Troca a permissão de um usuário na Tsuki Mangás.
	 * @param permission Nova permissão.
	 * @returns Retorna esse classe preenchida.
	 * @since 0.2.1
	 */
	async changePermission(
		permission: ReceivedFromApi['permission']
	): Promise<Required<TmUser>> {
		if (!this.id || !this.username)
			throw new ArgumentError(
				"A classe tem que ser preenchida primeiro. Use o método 'getByUsername' para isso."
			);
		else if (this.permission === permission)
			throw new ArgumentError('O usuário já tem essa permissão.');

		await apiRequest(
			'tm',
			`users/${this.id}`,
			`atualizar a permissão de **${this.username}**`,
			'POST',
			{ permission }
		);

		this.permission = permission;

		return this as Required<TmUser>;
	}

	/**
	 * Bane ou desbane um usuário na Tsuki Mangás.
	 * @param unban Desbanir o usuário?
	 * @returns Retorna esta classe preenchida.
	 * @since 0.2.1
	 */
	async ban(unban = false): Promise<Required<TmUser>> {
		if (!this.username || this.banned === undefined)
			throw new ArgumentError(
				"A classe tem que ser preenchida primeiro. Use o método 'getByUsername' para isso."
			);
		else if (!unban && this.banned)
			throw new ArgumentError('O usuário já está banido.');
		else if (unban && this.banned === false)
			throw new ArgumentError('O usuário não está banido.');

		await apiRequest(
			'tm',
			`users/banned/${this.username}`,
			`${unban ? 'desbanir' : 'banir'} o usuário **${this.username}**`,
			'POST',
			{ user: this.username }
		);

		this.banned = !unban;

		return this as Required<TmUser>;
	}
}

/**
 * Objeto recebido ao chamar a API.
 * @private
 * @since 0.1.0
 */
export type ReceivedFromApi = {
	id: number;
	username: string;
	name: string;
	birthday: string;
	gender: 0 | 1;
	city: string;
	avatar: string;
	cover: string;
	about: string;
	show_adult_content: 0 | 1;
	show_trailers: 0 | 1;
	vip: 0 | 1;
	permission: 0 | 1 | 2 | 3;
	banned: 0 | 1;
	level: number;
	experience: number;
	points: number;
};
