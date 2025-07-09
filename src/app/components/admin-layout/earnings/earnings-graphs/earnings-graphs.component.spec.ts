import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarningsGraphsComponent } from './earnings-graphs.component';

describe('EarningsGraphsComponent', () => {
  let component: EarningsGraphsComponent;
  let fixture: ComponentFixture<EarningsGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarningsGraphsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarningsGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
