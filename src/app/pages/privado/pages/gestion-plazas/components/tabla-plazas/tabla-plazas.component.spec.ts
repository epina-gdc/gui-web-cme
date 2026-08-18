import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPlazasComponent } from './tabla-plazas.component';

describe('TablaPlazasComponent', () => {
  let component: TablaPlazasComponent;
  let fixture: ComponentFixture<TablaPlazasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaPlazasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaPlazasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
