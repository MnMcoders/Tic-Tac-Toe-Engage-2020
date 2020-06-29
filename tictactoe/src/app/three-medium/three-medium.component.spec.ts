import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeMediumComponent } from './three-medium.component';

describe('ThreeMediumComponent', () => {
  let component: ThreeMediumComponent;
  let fixture: ComponentFixture<ThreeMediumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeMediumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeMediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
