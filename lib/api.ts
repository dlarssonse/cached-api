import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { APIInterceptor } from './api.interceptor';
import { IAPIClass } from './api.interface';
import { CachedAPIService } from './api.service';

export * from './api.component';
export * from './api.interceptor';
export * from './api.interface';
export * from './api.service';
export * from './cache';

@NgModule({
  declarations: [],
  exports: [HttpClientModule],
  imports: [CommonModule, HttpClientModule],
  providers: [CachedAPIService, { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true }],
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

/**
 * Returns the name of the class or type of the item submitted.
 * Uses either item.__className from IAPIClass, item.name or item.constructor.name
 * @param item
 */
export function getName(item: any): any {
  try {
    if ((item as IAPIClass)._className) {
      return (item as IAPIClass)._className;
    }
  } catch {
    // This is not a IAPIClass interface implemented class.
    // Try to get name of class from constructor, does not work with minified JS.
  }

  try {
    if (typeof item === 'function' && item.name) {
      return item.name;
    }
  } catch {
    // This is not a IAPIClass interface implemented class.
    // Try to get name of class from constructor, does not work with minified JS.
  }

  const prototype = Object.getPrototypeOf(item).constructor.name;
  return prototype;
}
