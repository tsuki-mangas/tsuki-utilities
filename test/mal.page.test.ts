import { Pages } from '../src';

describe('classe MalPage', () => {
	const MalPage = new Pages().mal,
		workingPagesId = [
			86337, // Black Clover
			70259, // Mushoku Tensei: Isekai Ittara Honki Desu
			110485, // Shuumatsu no Walküre
			121496, // Solo Leveling
			70941 // Domestic na Kanojo
		],
		deletedPagesId = [19352, 21569, 24351, 39120, 56738];

	it(`método get - Ids: ${workingPagesId.join(', ')}`, async () => {
		for (const id of workingPagesId.values())
			await expect(MalPage.get(id)).resolves.toHaveProperty('id');
	});

	it(`método get - Ids: ${deletedPagesId.join(', ')}`, async () => {
		for (const id of deletedPagesId.values())
			await expect(MalPage.get(id)).rejects.toThrow(Error);
	});
});
