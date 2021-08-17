import { Pages } from '../src';

describe('classe MdPage', () => {
	const MdPage = new Pages().md,
		workingPagesUuids = [
			'e7eabe96-aa17-476f-b431-2497d5e9d060', // Black Clover
			'bd6d0982-0091-4945-ad70-c028ed3c0917', // Mushoku Tensei ~Isekai Ittara Honki Dasu~
			'b5b21ca1-bba5-4b9a-8cd1-6248f731650b', // Shuumatsu no Valkyrie
			'32d76d19-8a05-4db0-9fc2-e0b0648fe9d0', // Solo Leveling
			'4f9eab7d-a2b2-4ee5-9d59-6744f0df4e12' // Domestic na Kanojo
		],
		randomPagesUuids = [
			'd55ebb6f-f0fc-45e7-b20b-f3056d5cfa68',
			'3c9650d5-d5b2-4513-983c-530e24f3f326',
			'650e382e-42e0-4f78-986b-8dc9abf90f5c',
			'b4804131-50a4-4f19-b1d0-71ad13f63cfd',
			'0f305ecb-ef2e-4a8e-9dc1-474eeca763fe'
		];

	it(`método get - Uuids: ${workingPagesUuids.join(', ')}`, done => {
		for (const uuid of workingPagesUuids.values())
			expect(MdPage.get(uuid)).resolves.toHaveProperty('ids');

		done();
	});

	it(`método get - Uuids: ${randomPagesUuids.join(', ')}`, done => {
		for (const uuid of randomPagesUuids.values())
			expect(MdPage.get(uuid)).rejects.toThrow(Error);

		done();
	});
});
