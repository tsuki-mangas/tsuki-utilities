import TmPage from './structures/tm/tm.page';
import TmUser from './structures/tm/tm.user';
import TmScan from './structures/tm/tm.scan';

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

export class Scans {
	tm: TmScan;

	constructor() {
		this.tm = new TmScan();
	}
}
