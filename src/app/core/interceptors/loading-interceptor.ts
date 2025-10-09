import type { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';

@Injectable()
export class loadingInterceptor implements HttpInterceptor {
  constructor(private spinner: NgxSpinnerService) { }
  private count = 0;

  private excludeService: Array<string> = [
    '/v1/refreshToken',
    
  ];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      
      
    if (this.isServiceExcluded(request.url) === false) {
      this.count++;
      this.spinner.show();
      return next.handle(request).pipe(
      finalize(() => {
          this.count--;
          if (this.count === 0) {
          setTimeout(() => {
            this.spinner.hide();
          }, 100);
          }
        })
      );
    }else{
      return next.handle(request);
    }
  }

  
  private isServiceExcluded(url: string): boolean {
    const found = this.excludeService.filter((service:any) => {
      
      if (url.includes(service)) {
        return service;
      }
      return null
    });

    return found.length > 0;
  }

}