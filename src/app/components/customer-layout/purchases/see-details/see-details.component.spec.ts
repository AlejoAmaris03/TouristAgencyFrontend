import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeDetailsComponent } from './see-details.component';

describe('SeeDetailsComponent', () => {
  let component: SeeDetailsComponent;
  let fixture: ComponentFixture<SeeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
