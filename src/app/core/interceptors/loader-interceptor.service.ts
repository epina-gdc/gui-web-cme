import type { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, Observable } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private readonly spinner: NgxSpinnerService) {
  }

  private count = 0;

  private readonly excludeService: Array<string> = [
    '/v1/refreshToken',
    // Excluir polling de asignaciones para evitar mostrar el spinner en cada poll
    '/mscme-asignacion/v1/plaza',
    '/mscme-asignacion/v1/plaza/totalAsignacionesPorTipo'
  ];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.isServiceExcluded(request.url)) {
      return next.handle(request);
    }

    this.count++;
    void this.spinner.show();
    return next.handle(request).pipe(
      finalize(() => {
        this.count--;
        if (this.count === 0) {
          setTimeout(() => {
            void this.spinner.hide();
          }, 100);
        }
      })
    );
  }

  private isServiceExcluded(url: string): boolean {
    const found = this.excludeService.filter((service: any) => {
      if (url.includes(service)) {
        return service;
      }
      return null
    });
    return found.length > 0;
  }

}
