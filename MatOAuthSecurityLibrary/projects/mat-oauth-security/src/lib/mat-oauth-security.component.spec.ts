import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatOAuthSecurityComponent } from './mat-oauth-security.component';

describe('MatOAuthSecurityComponent', () => {
  let component: MatOAuthSecurityComponent;
  let fixture: ComponentFixture<MatOAuthSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatOAuthSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatOAuthSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
