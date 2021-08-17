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

    it('should return 400 when there is a validation error', async () => {
      const newUser = {
        email: 'john@mail.com',
        password: 1234,
      };

      const { status, body } = await global.testRequest
        .post('/users')
        .send(newUser);
      expect(status).toBe(422);
      expect(body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'John',
        email: 'john@mail.com',
        password: 1234,
      };

      await global.testRequest.post('/users').send(newUser);

      const { status, body } = await global.testRequest
        .post('/users')
        .send(newUser);
      expect(status).toBe(409);
      expect(body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database',
      });
    });
  });
});
