import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Directive, Provider, Optional } from '@angular/core';

import { APIInterceptor } from './cached-api.interceptor';
import { CachedAPIService } from './cached-api.service';

export const API_PROVIDERS: Provider[] = [
  CachedAPIService,
  { 
    provide: HTTP_INTERCEPTORS, 
    useClass: APIInterceptor,
    multi: true 
  }
];

export const API_DIRECTIVES = [
  HttpClientModule, CommonModule,
];

@NgModule({
  declarations: [],
  exports: API_DIRECTIVES,
  imports: [HttpClientModule, CommonModule],
})
export class APIModule {
  static forRoot(): ModuleWithProviders<APIModule> {
    return {
      ngModule: APIModule,
      providers: [ CachedAPIService ]
    };
  }
}

