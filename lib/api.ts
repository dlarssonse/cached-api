import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { CachedAPIService } from './api.service';

export * from './api.service';
export * from './cache';

@NgModule({
  exports: [HttpClientModule],
  imports: [CommonModule, HttpClientModule],
})
export class APIModule {
  /**
   *
   * @param providers
   */
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: APIModule,
      providers: [CachedAPIService],
    };
  }
}
