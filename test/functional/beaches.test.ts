import { Beach } from '@src/models/beach';

describe('Beaches Functional test', () => {
  beforeAll(async () => await Beach.deleteMany({}));
  describe('When creating a beach ', () => {
    it('should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const { body, status } = await global.testRequest
        .post('/beaches')
        .send(newBeach);
      expect(status).toBe(201);

      expect(body).toEqual(expect.objectContaining(newBeach));
    });

    it('should return 422 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid_string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const { body, status } = await global.testRequest
        .post('/beaches')
        .send(newBeach);
      expect(status).toBe(422);

      expect(body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"',
      });
    });

    it.skip('should return 500 when there is any error othen than validation error', async () => {
      //TODO think in a way throw 500 error
    });
  });
});
