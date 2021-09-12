import { MalPage } from '../src';

describe('classe MalPage', () => {
	const malPage = new MalPage(),
		workingPagesId = [
			86337, // Black Clover
			70259, // Mushoku Tensei: Isekai Ittara Honki Desu
			110485, // Shuumatsu no Walküre
			121496, // Solo Leveling
			70941 // Domestic na Kanojo
		],
		deletedPagesId = [19352, 21569, 24351, 39120, 56738];

	test(`método get - Ids: ${workingPagesId.join(', ')}`, (done) => {
		for (const id of workingPagesId.values())
			setTimeout(
				() => expect(malPage.get(id)).resolves.toHaveProperty('id'),
				500
			);

		done();
	});

	test(`método get - Ids: ${deletedPagesId.join(', ')}`, (done) => {
		for (const id of deletedPagesId.values())
			setTimeout(() => expect(malPage.get(id)).rejects.toThrow(Error), 500);

		done();
	});
});
