import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatOAuthSecurityInterceptorComponent } from './mat-oauth-security-interceptor.component';

describe('MatOAuthSecurityInterceptorComponent', () => {
  let component: MatOAuthSecurityInterceptorComponent;
  let fixture: ComponentFixture<MatOAuthSecurityInterceptorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatOAuthSecurityInterceptorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatOAuthSecurityInterceptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
