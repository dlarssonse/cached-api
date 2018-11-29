import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, tap, timeInterval } from 'rxjs/operators';

import { CachedAPIData } from './cache';

@Injectable()
export class CachedAPIService {
  public cacheSize = 1;
  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private urls: string[];
  private cache: CachedAPIData[];

  /**
   *
   */
  constructor(private http: HttpClient) {
    this.urls = new Array<string>();
    this.cache = new Array<CachedAPIData>();
  }

  /**
   * @param name
   * @param url
   */
  public addURL(item: any, url: string): void {
    const prototype = this.getName(item);
    this.urls[prototype] = url;
  }

  /**
   *
   * @param item
   */
  public getName(item: any): any {
    const prototype = Object.getPrototypeOf(item).constructor.name;
    return prototype;
  }

  /**
   *
   * @param item
   * @param id
   */
  public clear(item: any, id?: any) {
    const name = this.getName(item);
    const cacheName = (name as any) + id;
    delete this.cache[cacheName];
  }

  /**
   *
   * @param item
   */
  public put<T>(item: T): Observable<T> {
    const url = this.getURL(item);
    return this.http.put<T>(url, item, this.httpOptions).pipe(
      tap(response => {
        /* Handle Response Stuff? */
      }),
    );
  }

  /**
   *
   * @param item
   */
  public post<T>(item: T): Observable<T> {
    const url = this.getURL(item);
    return this.http.post<T>(url, item, this.httpOptions).pipe(
      tap(response => {
        /* Handle Response Stuff? */
      }),
    );
  }

  /**
   *
   * @param item
   */
  public delete<T>(item: T, id: any): Observable<T> {
    const url = this.getURL(item) + '/' + id;
    return this.http.delete<T>(url, this.httpOptions).pipe(
      tap(response => {
        /* Handle Response Stuff? */
      }),
    );
  }

  /**
   *
   * @param item
   */
  public get<T>(item: T, id: any): Observable<T> {
    const name = this.getName(item);
    const cacheName = (name as any) + id;

    // Check if this is cached
    if (!this.cache[cacheName]) {
      const url = this.getURL(item) + '/' + id;
      this.cache[cacheName] = new CachedAPIData(name);
      this.cache[cacheName].setRequest(
        this.http.get<T>(url, this.httpOptions).pipe(
          tap((response: T) => {
            Object.assign(response, { __cachedAt: Date.now() });
          }),
          shareReplay(this.cacheSize),
        ),
      );
    }

    return this.cache[cacheName].getRequest();
  }

  /**
   *
   * @param item
   * @param id
   */
  public find<T>(item: T, query?: any): Observable<T> {
    const name = this.getName(item);
    const cacheName = (name as any) + query;

    // Check if this is cached
    if (!this.cache[cacheName]) {
      const url = this.getURL(item);
      this.cache[cacheName] = new CachedAPIData(name);
      this.cache[cacheName].setRequest(
        this.http.get<T[]>(url, this.httpOptions).pipe(
          tap((responses: T[]) => {
            const time = Date.now();
            responses.forEach(response => {
              Object.assign(response, { __cachedAt: time });
            });
          }),
          shareReplay(this.cacheSize),
        ),
      );
    }

    return this.cache[cacheName].getRequest();
  }

  /**
   *
   * @param item
   * @param name
   */
  private getURL<T>(item: T): any {
    if (name) {
      if (this.urls[name]) {
        return this.urls[name];
      }
    }

    const prototype = Object.getPrototypeOf(item).constructor.name;
    if (prototype) {
      if (this.urls[prototype]) {
        return this.urls[prototype];
      }
    }

    throw new Error("No URL found for '" + (name ? name : prototype) + "'.");
  }
}
