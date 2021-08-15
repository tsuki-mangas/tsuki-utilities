import { Pages } from '../src';

describe('classe MalPage', () => {
	const MalPage = new Pages().mal;

	it('método get - Id: 3', async () => {
		await expect(MalPage.get(3)).resolves.toHaveProperty('id');
	});

	it('método get - Id: 19495595', async () => {
		await expect(MalPage.get(19495595)).rejects.toThrow(Error);
	});
});
