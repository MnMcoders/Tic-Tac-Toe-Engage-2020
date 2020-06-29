import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NineXnineComponent } from './nine-xnine.component';

describe('NineXnineComponent', () => {
  let component: NineXnineComponent;
  let fixture: ComponentFixture<NineXnineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NineXnineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NineXnineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
