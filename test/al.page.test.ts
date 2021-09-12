import { AlPage } from '../src';

describe('classe AlPage', () => {
	const alPage = new AlPage(),
		workingPagesId = [
			86123, // Black Clover
			85564, // Mushoku Tensei: Isekai Ittara Honki Desu
			107098, // Shuumatsu no Walküre
			105398, // Solo Leveling
			85802 // Domestic na Kanojo
		],
		deletedPagesId = [29001, 29002, 29003, 29004, 29005];

	test(`método get - Ids: ${workingPagesId.join(', ')}`, (done) => {
		for (const id of workingPagesId.values())
			expect(alPage.get(id)).resolves.toHaveProperty('ids');

		done();
	});

	test(`método get - Ids: ${deletedPagesId.join(', ')}`, (done) => {
		for (const id of deletedPagesId.values())
			expect(alPage.get(id)).rejects.toThrow(Error);

		done();
	});
});
