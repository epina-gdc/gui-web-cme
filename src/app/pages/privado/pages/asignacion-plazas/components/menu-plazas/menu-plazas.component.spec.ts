import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuPlazasComponent} from './menu-plazas.component';

describe('MenuPlazasComponent', () => {
  let component: MenuPlazasComponent;
  let fixture: ComponentFixture<MenuPlazasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuPlazasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuPlazasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
