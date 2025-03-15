import { DynamicModule, Module } from '@nestjs/common';
import { ExternalLibService } from './external-lib.service';
import { ExternalLibOptions } from './external-lib.options';
import { EXTERNAL_LIB_OPTIONS } from './external-lib.constants';

@Module({})
export class ExternalLibModule {
  static forRoot(options: ExternalLibOptions): DynamicModule {
    return {
      module: ExternalLibModule,
      providers: [
        {
          provide: EXTERNAL_LIB_OPTIONS,
          useValue: options,
        },
        ExternalLibService
      ],
      exports: [ExternalLibService]
    }
  }
}
