import {Component, computed, Input, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {LoaderService} from '../../services/loader.service';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router
} from "@angular/router";

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: true,
  imports: [],
})
export class LoaderComponent implements OnInit {
  /**
   * Establece si el loader se debe mostrar cuando se navega entre rutas
   */
  @Input() activarLoaderNavegacionRutas: boolean = false;

  private readonly isLoadingSignal: WritableSignal<boolean> = signal<boolean>(false);

  readonly isLoading: Signal<boolean> = computed(() => this.isLoadingSignal());

  constructor(private readonly loaderService: LoaderService,
              private readonly router: Router) {
    this.loaderService.loader$.subscribe(
      (isLoading) => {
        this.isLoadingSignal.set(isLoading);
      });
  }

  ngOnInit(): void {
    if (!this.activarLoaderNavegacionRutas) return;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart || event instanceof RouteConfigLoadStart) {
        this.loaderService.activar();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationCancel ||
        event instanceof RouteConfigLoadEnd
      ) {
        this.loaderService.desactivar();
      }
    });
  }
}
