import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodysComponent } from './bodys.component';

describe('BodysComponent', () => {
  let component: BodysComponent;
  let fixture: ComponentFixture<BodysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BodysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BodysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
