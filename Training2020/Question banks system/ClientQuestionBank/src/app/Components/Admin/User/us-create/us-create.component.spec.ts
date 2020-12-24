import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsCreateComponent } from './us-create.component';

describe('UsCreateComponent', () => {
  let component: UsCreateComponent;
  let fixture: ComponentFixture<UsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
