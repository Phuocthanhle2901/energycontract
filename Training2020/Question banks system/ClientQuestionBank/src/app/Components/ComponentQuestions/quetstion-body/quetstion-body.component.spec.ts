import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuetstionBodyComponent } from './quetstion-body.component';

describe('QuetstionBodyComponent', () => {
  let component: QuetstionBodyComponent;
  let fixture: ComponentFixture<QuetstionBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuetstionBodyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuetstionBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
