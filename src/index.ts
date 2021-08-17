import TmPage from './structures/tm/tm.page';
import MdPage from './structures/md/md.page';
import MalPage from './structures/mal/mal.page';

import TmUser from './structures/tm/tm.user';

import TmScan from './structures/tm/tm.scan';

export class Pages {
	tm: TmPage;
	md: MdPage;
	mal: MalPage;

	constructor() {
		this.tm = new TmPage();
		this.md = new MdPage();
		this.mal = new MalPage();
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
