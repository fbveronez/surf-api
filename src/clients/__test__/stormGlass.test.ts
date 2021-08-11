import {StormGlass} from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWeather3HoursFixtures from '@test/fixtures/stormglass_weather_3_hours.json'
import stormGlassNormalized3HoursFixtures from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('Stormglass client', () => {
  it('should return the normalized forecast from the Stormglass service', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>

    const lat = -33.79;
    const lng = 151.28;

    mockedAxios.get.mockResolvedValue({data: stormGlassWeather3HoursFixtures});

    const stormglass = new StormGlass(mockedAxios);
    const response = await stormglass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalized3HoursFixtures);

  })
})

