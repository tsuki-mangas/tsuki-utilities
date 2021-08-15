import { Users } from '../src';

describe('classe TmUser', () => {
	const TmUser = new Users().tm,
		workingUsernames = ['rdx', 'Kinshiki', 'KeenKz', 'KARLOSP', 'SrLixo'],
		inexistantUsernames = [
			'azerty123',
			'poiuytreza321',
			'qualquer_coisaa',
			'sem_imaginacao',
			'naoSei741'
		];

	it(`método getByUsername - Usernames: ${workingUsernames.join(
		', '
	)}`, async () => {
		for (const username of workingUsernames.values())
			await expect(TmUser.getByUsername(username)).resolves.toHaveProperty(
				'id'
			);
	});

	it(`método getByUsername - Usernames: ${inexistantUsernames.join(
		', '
	)}`, async () => {
		for (const username of inexistantUsernames.values())
			await expect(TmUser.getByUsername(username)).rejects.toThrow(Error);
	});
});
