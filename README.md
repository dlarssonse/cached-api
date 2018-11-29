Cached API
=========

A library for handling cached web requests.

## Installation

  `npm install @dlarsson-se/cached-api -S`

## Example Usage

#### app.module.ts

  ```
  import { CachedAPIService } from '@dlarsson-se/cached-api;
  @NgModule({
    providers: [ CachedAPIService ]
  })
  export class AppModule { }
  ```

#### app.component.ts (without APIComponent inheritance)

  ```
  import { CachedAPIService } from '@dlarsson-se/cached-api';
  export class AppComponent {
    constructor(private api: CachedAPIService) {
      let testData = new TestData();
      let id = 1;
      api.addURL(testData, "http://localhost/testdata");
      api.get(testData, id).subscribe((value) => {
        console.log(value);
       }, (error) => {
        console.error(error);
       })
    }
  }
  ```

#### app.component.ts (with APIComponent inheritance)

  ```
  import { CachedAPIService, APIComponent } from '@dlarsson-se/cached-api';
  export class AppComponent extends APIComponent {
    constructor(public apiService: CachedAPIService) {
      super(apiService);
      let testClass = new TestData();
      let id = 1;
      this.apiService.addURL(new TestData(), "http://localhost/testdata");
      this.getAsync(testClass, id)
      Promise
        .all([this.getPromise(testClass)])
        .then((values) => {
          console.log(values);
        })
        .catch((error) => {
          console.error(error);
        }) 
    }
  }
  ```  


#### testdata.ts

  ```
  import { IAPIClass } from '@dlarsson-se/cached-api';
  export class TestData implements IAPIClass {
    public _cachedAt: number = 0;
    public _className: string = "TestData";
  }
  ```

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

  ```
  npm run format
  npm run lint
  ```