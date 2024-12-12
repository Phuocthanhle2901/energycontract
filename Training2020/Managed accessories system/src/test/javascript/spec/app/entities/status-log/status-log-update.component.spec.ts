import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { StatusLogUpdateComponent } from 'app/entities/status-log/status-log-update.component';
import { StatusLogService } from 'app/entities/status-log/status-log.service';
import { StatusLog } from 'app/shared/model/status-log.model';

describe('Component Tests', () => {
  describe('StatusLog Management Update Component', () => {
    let comp: StatusLogUpdateComponent;
    let fixture: ComponentFixture<StatusLogUpdateComponent>;
    let service: StatusLogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [StatusLogUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(StatusLogUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StatusLogUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(StatusLogService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new StatusLog(123);
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
        const entity = new StatusLog();
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
