import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { UserEquipmentActivityLogUpdateComponent } from 'app/entities/user-equipment-activity-log/user-equipment-activity-log-update.component';
import { UserEquipmentActivityLogService } from 'app/entities/user-equipment-activity-log/user-equipment-activity-log.service';
import { UserEquipmentActivityLog } from 'app/shared/model/user-equipment-activity-log.model';

describe('Component Tests', () => {
  describe('UserEquipmentActivityLog Management Update Component', () => {
    let comp: UserEquipmentActivityLogUpdateComponent;
    let fixture: ComponentFixture<UserEquipmentActivityLogUpdateComponent>;
    let service: UserEquipmentActivityLogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [UserEquipmentActivityLogUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(UserEquipmentActivityLogUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserEquipmentActivityLogUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(UserEquipmentActivityLogService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new UserEquipmentActivityLog(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new UserEquipmentActivityLog();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
