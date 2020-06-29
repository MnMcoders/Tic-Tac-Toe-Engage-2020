import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FourXfourComponent } from './four-xfour.component';

describe('FourXfourComponent', () => {
  let component: FourXfourComponent;
  let fixture: ComponentFixture<FourXfourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FourXfourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FourXfourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
