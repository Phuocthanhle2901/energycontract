import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { FormTypeUpdateComponent } from 'app/entities/form-type/form-type-update.component';
import { FormTypeService } from 'app/entities/form-type/form-type.service';
import { FormType } from 'app/shared/model/form-type.model';

describe('Component Tests', () => {
  describe('FormType Management Update Component', () => {
    let comp: FormTypeUpdateComponent;
    let fixture: ComponentFixture<FormTypeUpdateComponent>;
    let service: FormTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [FormTypeUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(FormTypeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FormTypeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(FormTypeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new FormType(123);
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
        const entity = new FormType();
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
