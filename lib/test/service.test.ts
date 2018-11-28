import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, Subscription } from 'rxjs';

import { CachedAPIService } from '../service';

class TestData {
  public id: any;
}

const httpGET = {
  get: jest.fn(),
};

const httpFIND = {
  get: jest.fn(),
};

const testData: TestData[] = [{ id: 0 }, { id: 1 }, { id: 2 }];

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
        expect(value.id).toBe(0);
        expect((value as any).__cached).toBeFalsy();
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
        expect(value.id).toBe(0);
        expect((value as any).__cached).toBeTruthy();
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
        expect(value.id).toBe(0);
        expect((value as any).__cached).toBeFalsy();
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
        expect((value as any)[0].id).toBe(0);
        expect((value as any)[0].__cached).toBeFalsy();
        expect((value as any)[1].id).toBe(1);
        expect((value as any)[1].__cached).toBeFalsy();
        expect((value as any)[2].id).toBe(2);
        expect((value as any)[2].__cached).toBeFalsy();
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
        expect((value as any)[0].id).toBe(0);
        expect((value as any)[0].__cached).toBeTruthy();
        expect((value as any)[1].id).toBe(1);
        expect((value as any)[1].__cached).toBeTruthy();
        expect((value as any)[2].id).toBe(2);
        expect((value as any)[2].__cached).toBeTruthy();
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
      value => {
        expect((value as any)[0].id).toBe(0);
        expect((value as any)[0].__cached).toBeFalsy();
        expect((value as any)[1].id).toBe(1);
        expect((value as any)[1].__cached).toBeFalsy();
        expect((value as any)[2].id).toBe(2);
        expect((value as any)[2].__cached).toBeFalsy();
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
