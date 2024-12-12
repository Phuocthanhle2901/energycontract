import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFirstComponent } from './content-first.component';

describe('ContentFirstComponent', () => {
  let component: ContentFirstComponent;
  let fixture: ComponentFixture<ContentFirstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentFirstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
