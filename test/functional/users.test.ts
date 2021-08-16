import { User } from '@src/models/user';

describe('Users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany();
  });
  describe('When creating a new user', () => {
    it('should succesfully create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };

      const { status, body } = await global.testRequest
        .post('/users')
        .send(newUser);
      expect(status).toBe(201);
      expect(body).toEqual(expect.objectContaining(newUser));
    });
  });
});
