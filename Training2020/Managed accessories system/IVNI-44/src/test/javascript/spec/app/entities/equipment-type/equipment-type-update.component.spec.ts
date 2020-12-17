import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { EquipmentTypeUpdateComponent } from 'app/entities/equipment-type/equipment-type-update.component';
import { EquipmentTypeService } from 'app/entities/equipment-type/equipment-type.service';
import { EquipmentType } from 'app/shared/model/equipment-type.model';

describe('Component Tests', () => {
  describe('EquipmentType Management Update Component', () => {
    let comp: EquipmentTypeUpdateComponent;
    let fixture: ComponentFixture<EquipmentTypeUpdateComponent>;
    let service: EquipmentTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [EquipmentTypeUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(EquipmentTypeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EquipmentTypeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EquipmentTypeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new EquipmentType(123);
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
        const entity = new EquipmentType();
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
