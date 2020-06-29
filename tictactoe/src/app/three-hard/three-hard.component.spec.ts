import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeHardComponent } from './three-hard.component';

describe('ThreeHardComponent', () => {
  let component: ThreeHardComponent;
  let fixture: ComponentFixture<ThreeHardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeHardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeHardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
