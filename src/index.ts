import TmPage from './structures/tm/tm.page';
import TmUser from './structures/tm/tm.user';

export class Pages {
	tm: TmPage;

	constructor() {
		this.tm = new TmPage();
	}
}

export class Users {
	tm: TmUser;

	constructor() {
		this.tm = new TmUser();
	}
}
