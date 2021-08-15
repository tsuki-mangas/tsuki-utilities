import { Users } from '../src';

describe('classe TmUser', () => {
	const TmUser = new Users().tm;

	it('método getByUsername - Username: luf', () => {
		expect(TmUser.getByUsername('luf')).resolves.toHaveProperty('id');
	});

	it('método getByUsername - Username: aqsx26d29r5f9r', () => {
		expect(TmUser.getByUsername('aqsx26d29r5f9r')).rejects.toThrow(Error);
	});
});