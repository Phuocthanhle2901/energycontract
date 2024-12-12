import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { StatusTypeUpdateComponent } from 'app/entities/status-type/status-type-update.component';
import { StatusTypeService } from 'app/entities/status-type/status-type.service';
import { StatusType } from 'app/shared/model/status-type.model';

describe('Component Tests', () => {
  describe('StatusType Management Update Component', () => {
    let comp: StatusTypeUpdateComponent;
    let fixture: ComponentFixture<StatusTypeUpdateComponent>;
    let service: StatusTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [StatusTypeUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(StatusTypeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StatusTypeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(StatusTypeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new StatusType(123);
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
        const entity = new StatusType();
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
