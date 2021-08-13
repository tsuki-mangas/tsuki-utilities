import { Users } from '../src';

describe('classe TmUser', () => {
	const TmUser = new Users().tm;

	it('método Get - Username: luf', () => {
		expect(TmUser.getByUsername('luf')).resolves.toHaveProperty('id');
	});

	it('método Get - Username: aqsx26d29r5f9r', () => {
		expect(TmUser.getByUsername('aqsx26d29r5f9r')).rejects.toThrow(Error);
	});
});
