import { Pages } from '../src';

describe('classe TmPage', () => {
	const TmPage = new Pages().tm,
		workingPagesId = [
			25, // Black Clover
			945, // Mushoku Tensei ~Isekai Ittara Honki Dasu~
			452, // Shuumatsu no Valkyrie
			1, // Solo Leveling
			10 // Domestic na Kanojo
		],
		deletedPagesId = [4, 451, 1113, 1784, 2576];

	it(`método get - Ids: ${workingPagesId.join(', ')}`, done => {
		for (const id of workingPagesId.values())
			expect(TmPage.get(id)).resolves.toHaveProperty('ids');

		done();
	});

	it(`método get - Ids: ${deletedPagesId.join(', ')}`, done => {
		for (const id of deletedPagesId.values())
			expect(TmPage.get(id)).rejects.toThrow(Error);

		done();
	});
});
