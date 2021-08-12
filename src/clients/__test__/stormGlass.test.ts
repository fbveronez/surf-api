import {StormGlass} from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWeather3HoursFixtures from '@test/fixtures/stormglass_weather_3_hours.json'
import stormGlassNormalized3HoursFixtures from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('Stormglass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  it('should return the normalized forecast from the Stormglass service', async () => {
    const lat = -33.79;
    const lng = 151.28;

    mockedAxios.get.mockResolvedValue({data: stormGlassWeather3HoursFixtures});

    const stormglass = new StormGlass(mockedAxios);
    const response = await stormglass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalized3HoursFixtures);

  })

  it('should exclude incomplete data points', async () => {
    const lat = -33.79;
    const lng = 151.28;

    const incompleteResponde = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-12T00:00:00+00:00',
        },
      ],
    }

    mockedAxios.get.mockResolvedValue({data: incompleteResponde});

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  })

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat = -33.79;
    const lng = 151.28;

    mockedAxios.get.mockRejectedValue({message: 'Network Error'});

    const stormglass = new StormGlass(mockedAxios);

    await expect(stormglass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to comunicate to StormGlass: Network Error'
    );
  })

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.79;
    const lng = 151.28;

    mockedAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: {errors: ['Rate Limit reached']},
      },
    });

    const stormglass = new StormGlass(mockedAxios);

    await expect(stormglass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error return by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429',
    );
  })


})

