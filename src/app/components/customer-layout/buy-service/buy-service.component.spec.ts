import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyServiceComponent } from './buy-service.component';

describe('BuyServiceComponent', () => {
  let component: BuyServiceComponent;
  let fixture: ComponentFixture<BuyServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
