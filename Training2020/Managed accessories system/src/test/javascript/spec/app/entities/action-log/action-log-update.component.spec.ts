import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { ActionLogUpdateComponent } from 'app/entities/action-log/action-log-update.component';
import { ActionLogService } from 'app/entities/action-log/action-log.service';
import { ActionLog } from 'app/shared/model/action-log.model';

describe('Component Tests', () => {
  describe('ActionLog Management Update Component', () => {
    let comp: ActionLogUpdateComponent;
    let fixture: ComponentFixture<ActionLogUpdateComponent>;
    let service: ActionLogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [ActionLogUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ActionLogUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActionLogUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ActionLogService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ActionLog(123);
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
        const entity = new ActionLog();
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
