import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { UserEquipmentActivityLogDetailComponent } from 'app/entities/user-equipment-activity-log/user-equipment-activity-log-detail.component';
import { UserEquipmentActivityLog } from 'app/shared/model/user-equipment-activity-log.model';

describe('Component Tests', () => {
  describe('UserEquipmentActivityLog Management Detail Component', () => {
    let comp: UserEquipmentActivityLogDetailComponent;
    let fixture: ComponentFixture<UserEquipmentActivityLogDetailComponent>;
    const route = ({ data: of({ userEquipmentActivityLog: new UserEquipmentActivityLog(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [UserEquipmentActivityLogDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(UserEquipmentActivityLogDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UserEquipmentActivityLogDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load userEquipmentActivityLog on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.userEquipmentActivityLog).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
