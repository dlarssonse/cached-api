import { OnDestroy, OnInit } from '@angular/core';
import { getName } from './api';
import { CachedAPIService } from './api.service';

export * from './api.interface';
export * from './api.service';
export * from './cache';

/**
 * Extend this class to enable getAsync, putAsync, postAsync, deleteAsync, findAsync.
 */
export class APIComponent implements OnInit, OnDestroy {
  /** Array of all promises. */
  private promises: Array<Promise<{}>>;

  /**
   *
   * @param apiService
   */
  constructor(public apiService: CachedAPIService) {
    this.promises = new Array<Promise<{}>>();
  }

  /**
   *
   * @param item
   * @param id
   */
  public getAsync(item: any, id: any): Promise<{}> {
    const name = getName(item);
    this.promises[name + id] = new Promise((resolve, reject) => {
      this.apiService.get(item, id).subscribe(
        value => {
          resolve(value);
        },
        error => {
          reject(error);
        },
      );
    });
    Object.assign(this.promises[name + id], { _className: name, _promiseName: name + id });
    return this.promises[name + id];
  }

  /**
   *
   * @param item
   * @param query
   */
  public findAsync(item: any, query?: any): Promise<{}> {
    const name = getName(item);
    this.promises[name + (query ? query : '')] = new Promise((resolve, reject) => {
      this.apiService.find(item, query).subscribe(
        value => {
          resolve(value);
        },
        error => {
          reject(error);
        },
      );
    });
    Object.assign(this.promises[name + (query ? query : '')], {
      _className: name,
      _promiseName: name + (query ? query : ''),
    });
    return this.promises[name + (query ? query : '')];
  }

  /**
   *
   * @param item
   */
  public getPromise(item: any, opt?: any): Promise<{}> {
    const name = getName(item);
    return this.promises[name + (opt ? opt : '')];
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
