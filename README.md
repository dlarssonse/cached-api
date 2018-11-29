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
    imports: [ APIModule.forRoot() ]
  })
  export class AppModule {
    constructor(public apiService: CachedAPIService) {

      /* If the requests should contain Authorization: Bearer TOKEN */
      apiService.setToken('YOUR_TOKEN');                                 

      /* Default URL for TestData objects. */
      apiService.addURL(TestData, "http://localhost/testdata");         

      /* Custom URL for the find command. */ 
      apiService.addURL(TestData, "http://localhost/testdatas", "find"); 
    }
  }
  ```

#### app.component.ts (without APIComponent inheritance)

  ```
  import { CachedAPIService } from '@dlarsson-se/cached-api';
  export class AppComponent {
    constructor(private apiService: CachedAPIService) {
      let id = 1;

      /* Get By ID */
      apiService.get(TestData, id)
        .subscribe((value) => {
          /* Do something with the reply. */
        }, (error) => {
          /* Error handling. */
        })

      /* Find */
      apiService.find(TestData)
        .subscribe((values) => {
          /* Do something with the reply. */
        }, (error) => {
          /* Error handling. */
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
      let id = 1;
      
      /* get with mandatory supplied id. */
      let p1 = this.getAsync(TestData, id)

      /* find with optional querystring. */
      let p2 = this.findAsync(TestData, "YOUR_QUERY_HERE") 
      Promise
        .all([p1, p2])
        .then((values) => {
          /* Do something with the reply. */
        })
        .catch((error) => {
          /* Error handling. */
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