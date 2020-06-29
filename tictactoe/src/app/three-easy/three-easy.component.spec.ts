import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeEasyComponent } from './three-easy.component';

describe('ThreeEasyComponent', () => {
  let component: ThreeEasyComponent;
  let fixture: ComponentFixture<ThreeEasyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeEasyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeEasyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
