import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Campeonato } from './campeonato';

describe('Campeonato', () => {
  let component: Campeonato;
  let fixture: ComponentFixture<Campeonato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Campeonato]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Campeonato);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
