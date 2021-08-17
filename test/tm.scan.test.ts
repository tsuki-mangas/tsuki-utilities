import { Scans } from '../src';

describe('classe TmScan', () => {
	const TmScan = new Scans().tm,
		workingScansId = [
			85, // Tyrant Scans
			325, // Simple Scan
			657, // Indie Group
			896, // CK Scans
			1280 // Toxic Squad Scan
		],
		workingScansSlug = [
			'potrinho-alegre-scans',
			'si-lensce',
			'cohen-yaoi-shonen-ai',
			'don-s-scan',
			'triade-scanlator'
		],
		deletedScansId = [110, 449, 764, 1018, 1290];

	it(`método getById - Ids: ${workingScansId.join(', ')}`, done => {
		for (const id of workingScansId.values())
			expect(TmScan.getById(id)).resolves.toHaveProperty('id');

		done();
	});

	it(`método getBySlug - Slugs: ${workingScansSlug.join(', ')}`, done => {
		for (const slug of workingScansSlug.values())
			expect(TmScan.getBySlug(slug)).resolves.toHaveProperty('id');

		done();
	});

	it(`método getById - Ids: ${deletedScansId.join(', ')}`, done => {
		for (const id of deletedScansId.values())
			expect(TmScan.getById(id)).rejects.toThrow(Error);

		done();
	});
});
