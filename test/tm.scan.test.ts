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

	it(`método getById - Ids: ${workingScansId.join(', ')}`, async () => {
		for (const id of workingScansId.values())
			await expect(TmScan.getById(id)).resolves.toHaveProperty('id');
	});

	it(`método getBySlug - Slugs: ${workingScansSlug.join(', ')}`, async () => {
		for (const slug of workingScansSlug.values())
			await expect(TmScan.getBySlug(slug)).resolves.toHaveProperty('id');
	});

	it(`método getById - Ids: ${deletedScansId.join(', ')}`, async () => {
		for (const id of deletedScansId.values())
			await expect(TmScan.getById(id)).rejects.toThrow(Error);
	});
});
