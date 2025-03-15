import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { EXTERNAL_LIB_OPTIONS } from './external-lib.constants';
import { ExternalLibOptions } from './external-lib.options';

@Injectable()
export class ExternalLibService {
  private axiosInstance: AxiosInstance;

  constructor(
    @Inject(EXTERNAL_LIB_OPTIONS) private options: ExternalLibOptions,
  ) {
    const axiosConfig: any = {
      baseURL: this.options.baseUrl,
    };

    if (this.options.tokenType === 'params') {
      axiosConfig.params = { appid: this.options.apiKey };
    } else {
      axiosConfig.headers = { Authorization: `Bearer ${this.options.apiKey}` };
    }

    this.axiosInstance = axios.create(axiosConfig);
  }

  private handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;

      if (axiosError.response) {
        throw new HttpException(
          {
            statusCode: axiosError.response.status,
            message: axiosError.response.data?.message || 'External API Error',
          },
          axiosError.response.status || HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Error connecting to external API',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    throw new HttpException(
      'Unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async getData(endpoint: string) {
    const response = await this.axiosInstance.get(endpoint);
    return response.data;
  }
}
