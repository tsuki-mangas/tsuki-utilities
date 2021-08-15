import { Pages } from '../src';

describe('classe TmPage', () => {
	const TmPage = new Pages().tm;

	it('método get - Id: 1', async () => {
		await expect(TmPage.get(1)).resolves.toHaveProperty('ids');
	});

	it('método get - Id: 19495', async () => {
		await expect(TmPage.get(19495)).rejects.toThrow(Error);
	});
});
