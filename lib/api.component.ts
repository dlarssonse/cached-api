import { OnDestroy, OnInit } from '@angular/core';

import { CachedAPIService } from './api.service';

export * from './api.interface';
export * from './api.service';
export * from './cache';

export class APIComponent implements OnInit, OnDestroy {
  /** Array of all promises. */
  private promises: Array<Promise<{}>>;

  constructor(public apiService: CachedAPIService) {
    this.promises = new Array<Promise<{}>>();
  }

  /**
   *
   * @param item
   * @param id
   */
  public getAsync(item: any, id: any): void {
    const name = this.apiService.getName(item);
    this.promises[name] = new Promise((resolve, reject) => {
      this.apiService.get(item, id).subscribe(
        value => {
          resolve(value);
        },
        error => {
          reject(error);
        },
      );
    });
  }

  /**
   *
   * @param item
   */
  public getPromise(item: any): Promise<{}> {
    const name = this.apiService.getName(item);
    return this.promises[name];
  }

  /**
   *
   */
  public ngOnInit(): void {
    /* Nothing here yet */
  }

  /**
   *
   */
  public ngOnDestroy(): void {
    /* Nothing here yet */
  }
}
