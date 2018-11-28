import { Observable, of } from 'rxjs';

/**
 *
 */
export class CachedAPIData {
  public name: string;
  private request: any;

  /**
   *
   * @param name
   */
  constructor(name: string) {
    this.name = name;
    this.request = null;
  }

  /**
   *
   */
  public getRequest(): any {
    return this.request;
  }

  /**
   *
   * @param value
   */
  public setRequest(request: any): void {
    this.request = request;
  }
}
