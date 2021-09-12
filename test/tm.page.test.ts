import { TmPage } from '../src';

describe('classe TmPage', () => {
	const tmPage = new TmPage(),
		workingPagesId = [
			25, // Black Clover
			945, // Mushoku Tensei ~Isekai Ittara Honki Dasu~
			452, // Shuumatsu no Valkyrie
			1, // Solo Leveling
			10 // Domestic na Kanojo
		],
		searchQuery = 'Solo Leveling',
		deletedPagesId = [4, 451, 1113, 1784, 2576];

	it(`método get - Ids: ${workingPagesId.join(', ')}`, (done) => {
		for (const id of workingPagesId.values())
			expect(tmPage.get(id)).resolves.toHaveProperty('ids');

		done();
	});

	it(`método search - Query: ${searchQuery}`, (done) => {
		expect(tmPage.search(searchQuery)).resolves;
		done();
	});

	it(`método get - Ids: ${deletedPagesId.join(', ')}`, (done) => {
		for (const id of deletedPagesId.values())
			expect(tmPage.get(id)).rejects.toThrow(Error);

		done();
	});
});
