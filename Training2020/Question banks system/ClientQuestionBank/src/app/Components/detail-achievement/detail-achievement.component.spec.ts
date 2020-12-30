import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAchievementComponent } from './detail-achievement.component';

describe('DetailAchievementComponent', () => {
  let component: DetailAchievementComponent;
  let fixture: ComponentFixture<DetailAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailAchievementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
