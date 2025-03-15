import { Test, TestingModule } from '@nestjs/testing';
import { ExternalLibService } from './external-lib.service';
import axios, { AxiosInstance } from 'axios';
import { ExternalLibOptions } from './external-lib.options';
import { EXTERNAL_LIB_OPTIONS } from './external-lib.constants';

jest.mock('axios');

describe('ExternalLibService', () => {
  let service: ExternalLibService;
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;

  const mockOptions: ExternalLibOptions = {
    apiKey: 'test-api-key',
    baseUrl: 'https://api.example.com',
  };

  beforeEach(async () => {
    mockAxiosInstance = {
      get: jest.fn(),
      defaults: { baseURL: mockOptions.baseUrl, headers: { Authorization: `Bearer ${mockOptions.apiKey}` } },
    } as any;

    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalLibService,
        {
          provide: EXTERNAL_LIB_OPTIONS,
          useValue: mockOptions,
        },
      ],
    }).compile();

    service = module.get<ExternalLibService>(ExternalLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an axios instance with correct settings', () => {
    expect(service).toHaveProperty('axiosInstance');
    expect(service['axiosInstance'].defaults.baseURL).toBe(mockOptions.baseUrl);
    expect(service['axiosInstance'].defaults.headers['Authorization']).toBe(`Bearer ${mockOptions.apiKey}`);
  });

  it('should call axios.get correctly and return data', async () => {
    const mockResponse = { data: { message: 'success' } };
    mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

    const result = await service.getData('/test-endpoint');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint');
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw an error when the request fails', async () => {
    mockAxiosInstance.get.mockRejectedValueOnce(new Error('API request failed'));

    await expect(service.getData('/test-endpoint')).rejects.toThrow('API request failed');
  });
});
