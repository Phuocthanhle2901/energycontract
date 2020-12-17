import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsUpdateComponent } from './us-update.component';

describe('UsUpdateComponent', () => {
  let component: UsUpdateComponent;
  let fixture: ComponentFixture<UsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
