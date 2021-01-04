import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { UserEquipmentActivityLogComponent } from 'app/entities/user-equipment-activity-log/user-equipment-activity-log.component';
import { UserEquipmentActivityLogService } from 'app/entities/user-equipment-activity-log/user-equipment-activity-log.service';
import { UserEquipmentActivityLog } from 'app/shared/model/user-equipment-activity-log.model';

describe('Component Tests', () => {
  describe('UserEquipmentActivityLog Management Component', () => {
    let comp: UserEquipmentActivityLogComponent;
    let fixture: ComponentFixture<UserEquipmentActivityLogComponent>;
    let service: UserEquipmentActivityLogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [UserEquipmentActivityLogComponent],
      })
        .overrideTemplate(UserEquipmentActivityLogComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserEquipmentActivityLogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(UserEquipmentActivityLogService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new UserEquipmentActivityLog(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.userEquipmentActivityLogs && comp.userEquipmentActivityLogs[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
