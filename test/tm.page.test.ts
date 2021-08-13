import { Pages } from '../src';

describe('classe TmPage', () => {
	const TmPage = new Pages().tm;

	it('método Get - ID: 1', () => {
		expect(TmPage.get(1)).resolves.toHaveProperty('ids');
	});

	it('método Get - ID: 19495', () => {
		expect(TmPage.get(19495)).rejects.toThrow(Error);
	});
});
