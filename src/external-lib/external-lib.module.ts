import { DynamicModule, Module } from '@nestjs/common';
import { EXTERNAL_LIB_OPTIONS } from './external-lib.constants';
import { ExternalLibOptions } from './external-lib.options';
import { ExternalLibService } from './external-lib.service';

@Module({})
export class ExternalLibModule {
  static forRoot(options: ExternalLibOptions): DynamicModule {
    return {
      module: ExternalLibModule,
      providers: [
        ExternalLibService,
        {
          provide: EXTERNAL_LIB_OPTIONS,
          useValue: options,
        },
      ],
      exports: [ExternalLibService],
    };
  }

  static forRootAsync(options: {
    imports: any[];
    inject: any[];
    useFactory: (...args: any[]) => ExternalLibOptions;
  }): DynamicModule {
    return {
      module: ExternalLibModule,
      imports: options.imports,
      providers: [
        ExternalLibService,
        {
          provide: EXTERNAL_LIB_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [ExternalLibService],
    };
  }
}
