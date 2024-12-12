import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { FormUpdateComponent } from 'app/entities/form/form-update.component';
import { FormService } from 'app/entities/form/form.service';
import { Form } from 'app/shared/model/form.model';

describe('Component Tests', () => {
  describe('Form Management Update Component', () => {
    let comp: FormUpdateComponent;
    let fixture: ComponentFixture<FormUpdateComponent>;
    let service: FormService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [FormUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(FormUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FormUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(FormService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Form(123);
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
        const entity = new Form();
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
