import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionistaListasComponent } from './comisionista-listas.component';

describe('ComisionistaListasComponent', () => {
  let component: ComisionistaListasComponent;
  let fixture: ComponentFixture<ComisionistaListasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComisionistaListasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComisionistaListasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
