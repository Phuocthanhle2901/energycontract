import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { MockEventManager } from '../../../helpers/mock-event-manager.service';
import { MockActiveModal } from '../../../helpers/mock-active-modal.service';
import { UserEquipmentActivityLogDeleteDialogComponent } from 'app/entities/user-equipment-activity-log/user-equipment-activity-log-delete-dialog.component';
import { UserEquipmentActivityLogService } from 'app/entities/user-equipment-activity-log/user-equipment-activity-log.service';

describe('Component Tests', () => {
  describe('UserEquipmentActivityLog Management Delete Component', () => {
    let comp: UserEquipmentActivityLogDeleteDialogComponent;
    let fixture: ComponentFixture<UserEquipmentActivityLogDeleteDialogComponent>;
    let service: UserEquipmentActivityLogService;
    let mockEventManager: MockEventManager;
    let mockActiveModal: MockActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [UserEquipmentActivityLogDeleteDialogComponent],
      })
        .overrideTemplate(UserEquipmentActivityLogDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UserEquipmentActivityLogDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(UserEquipmentActivityLogService);
      mockEventManager = TestBed.get(JhiEventManager);
      mockActiveModal = TestBed.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.closeSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
      });
    });
  });
});
