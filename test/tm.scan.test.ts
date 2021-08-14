import { Scans } from '../src';

describe('classe TmScan', () => {
	const TmScan = new Scans().tm;

	it('método getById - Id: 3', () => {
		expect(TmScan.getById(3)).resolves.toHaveProperty('id');
	});

	it('método getByName - Name: Tekkadan Scan', () => {
		expect(TmScan.getByName('Tekkadan Scan')).resolves.toHaveProperty('id');
	});

	it('método getByName - Name: a95944d84d', () => {
		expect(TmScan.getByName('a95944d84d')).rejects.toThrow(Error);
	});
});
