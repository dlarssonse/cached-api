import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, Subscription } from 'rxjs';

import { IAPIClass } from '../api.interface';
import { CachedAPIService } from '../api.service';

class TestData implements IAPIClass {
  public id: any;
  public _cachedAt: number = 0;
  public _className: string = 'TestData';
}

const httpGET = {
  get: jest.fn(),
};

const httpFIND = {
  get: jest.fn(),
};

const testData: TestData[] = [new TestData(), new TestData(), new TestData()];

describe('CachedAPIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [CachedAPIService, HttpTestingController],
    });
  });

  const serviceGET = new CachedAPIService(httpGET as any);
  const serviceFIND = new CachedAPIService(httpFIND as any);

  it(`should be instance of CachedAPIService`, () => {
    expect(serviceGET).toBeInstanceOf(CachedAPIService);
    expect(serviceFIND).toBeInstanceOf(CachedAPIService);
  });

  it('adding an URL should be automatic', () => {
    const name = serviceGET.getName(new TestData());
    expect(name).toBe('TestData');
    serviceFIND.getName(new TestData());

    const result = serviceGET.addURL(new TestData(), 'localhost');
    expect(result).toBeUndefined();
    serviceFIND.addURL(new TestData(), 'localhost');
  });

  /*
  it('PUT', () => {
    let result = service.put(new TestData()).subscribe((value) => {
      expect(value).toBeInstanceOf(TestData);
    })
    expect(result).toBeInstanceOf(Subscription);
  })

  it('POST', () => {
    let result = service.post(new TestData()).subscribe((value) => {
      expect(value).toBeInstanceOf(TestData);
    })
    expect(result).toBeInstanceOf(Subscription);
  })

  it('DELETE', () => {
    let result = service.delete(new TestData(), 1).subscribe((value) => {
      expect(value).toBeInstanceOf(TestData);
    })
    expect(result).toBeInstanceOf(Subscription);
  })
  */

  /**
   * Request for previously uncached data.
   */
  it('GET (uncached)', done => {
    httpGET.get.mockImplementationOnce(() => of(testData[0]));
    const result = serviceGET.get(new TestData(), 0).subscribe(
      (value: any) => {
        expect((value as any)._cachedAt).toBeDefined();
        done();
      },
      (error: any) => {
        expect(error).toBeNull();
        done();
      },
    );
    expect(result).toBeInstanceOf(Subscription);
  });

  /**
   * Repeat of last request, should return a cached dataset.
   */
  it('GET (cached)', done => {
    httpGET.get.mockImplementationOnce(() => of(testData[0]));
    const result = serviceGET.get(new TestData(), 0).subscribe(
      (value: any) => {
        expect((value as any)._cachedAt).toBeDefined();
        done();
      },
      (error: any) => {
        expect(error).toBeNull();
        done();
      },
    );
    expect(result).toBeInstanceOf(Subscription);
  });

  /**
   * Request to get with 0 id, but with cache cleared first.
   */
  it('GET (cleared cache)', done => {
    httpGET.get.mockImplementationOnce(() => of(testData[0]));
    serviceGET.clear(new TestData(), 0);
    const result = serviceGET.get(new TestData(), 0).subscribe(
      (value: any) => {
        expect((value as any)._cachedAt).toBeDefined();
        done();
      },
      (error: any) => {
        expect(error).toBeNull();
        done();
      },
    );
    expect(result).toBeInstanceOf(Subscription);
  });

  /**
   * Request for previously uncached data.
   */
  it('FIND (uncached)', done => {
    httpFIND.get.mockImplementationOnce(() => of(testData));
    const result = serviceFIND.find(new TestData()).subscribe(
      (value: any) => {
        expect((value as TestData[]).length).toBe(3);
        expect((value as any)[0]._cachedAt).toBeDefined();
        expect((value as any)[1]._cachedAt).toBeDefined();
        expect((value as any)[2]._cachedAt).toBeDefined();
        done();
      },
      (error: any) => {
        expect(error).toBeNull();
        done();
      },
    );
    expect(result).toBeInstanceOf(Subscription);
  });

  /**
   * Repeat of previous request.
   */
  it('FIND (cache)', done => {
    httpFIND.get.mockImplementationOnce(() => of(testData));
    const result = serviceFIND.find(new TestData()).subscribe(
      (value: any) => {
        expect((value as TestData[]).length).toBe(3);
        expect((value as any)[0]._cachedAt).toBeDefined();
        expect((value as any)[1]._cachedAt).toBeDefined();
        expect((value as any)[2]._cachedAt).toBeDefined();
        done();
      },
      (error: any) => {
        expect(error).toBeNull();
        done();
      },
    );
    expect(result).toBeInstanceOf(Subscription);
  });

  /**
   * Request for previously uncached data.
   */
  it('FIND (cleared cache)', done => {
    httpFIND.get.mockImplementationOnce(() => of(testData));
    serviceFIND.clear(new TestData());
    const result = serviceFIND.find(new TestData()).subscribe(
      (value: any) => {
        expect((value as TestData[]).length).toBe(3);
        expect((value as any)[0]._cachedAt).toBeDefined();
        expect((value as any)[1]._cachedAt).toBeDefined();
        expect((value as any)[2]._cachedAt).toBeDefined();
        done();
      },
      (error: any) => {
        expect(error).toBeNull();
        done();
      },
    );
    expect(result).toBeInstanceOf(Subscription);
  });
});
