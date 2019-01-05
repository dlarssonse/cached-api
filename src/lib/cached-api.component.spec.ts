import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CachedApiComponent } from './cached-api.component';

describe('CachedApiComponent', () => {
  let component: CachedApiComponent;
  let fixture: ComponentFixture<CachedApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CachedApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CachedApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
