import { TmUser } from '../src';

describe('classe TmUser', () => {
	const tmUser = new TmUser(),
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
	)}`, (done) => {
		for (const username of workingUsernames.values())
			expect(tmUser.getByUsername(username)).resolves.toHaveProperty('id');

		done();
	});

	it(`método getByUsername - Usernames: ${inexistantUsernames.join(
		', '
	)}`, (done) => {
		for (const username of inexistantUsernames.values())
			expect(tmUser.getByUsername(username)).rejects.toThrow(Error);

		done();
	});
});
