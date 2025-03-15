import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { EXTERNAL_LIB_OPTIONS } from './external-lib.constants';
import { ExternalLibOptions } from './external-lib.options';

@Injectable()
export class ExternalLibService {
  private axiosInstance: AxiosInstance

  constructor(@Inject(EXTERNAL_LIB_OPTIONS) private options: ExternalLibOptions) {
    this.axiosInstance = axios.create({
      baseURL: this.options.baseUrl,
      headers: { Authorization: `Bearer ${this.options.apiKey}` },
    });
  }

  async getData(endpoint: string) {
    const response = await this.axiosInstance.get(endpoint);
    return response.data;
  }
}
