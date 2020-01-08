import { NgModule } from '@angular/core';
import { MatOAuthSecurityComponent } from './mat-oauth-security.component';
import { MatOAuthSecurityInterceptorComponent } from './mat-oauth-security-interceptor/mat-oauth-security-interceptor.component';

@NgModule({
  declarations: [MatOAuthSecurityComponent, MatOAuthSecurityInterceptorComponent],
  imports: [
  ],
  exports: [MatOAuthSecurityComponent]
})
export class MatOAuthSecurityModule { }
