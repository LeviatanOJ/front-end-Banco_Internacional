import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorningActivate } from './morning-activate';

describe('MorningActivate', () => {
  let component: MorningActivate;
  let fixture: ComponentFixture<MorningActivate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MorningActivate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorningActivate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
