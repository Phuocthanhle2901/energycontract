import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { EquipmentGroupUpdateComponent } from 'app/entities/equipment-group/equipment-group-update.component';
import { EquipmentGroupService } from 'app/entities/equipment-group/equipment-group.service';
import { EquipmentGroup } from 'app/shared/model/equipment-group.model';

describe('Component Tests', () => {
  describe('EquipmentGroup Management Update Component', () => {
    let comp: EquipmentGroupUpdateComponent;
    let fixture: ComponentFixture<EquipmentGroupUpdateComponent>;
    let service: EquipmentGroupService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [EquipmentGroupUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(EquipmentGroupUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EquipmentGroupUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EquipmentGroupService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new EquipmentGroup(123);
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
        const entity = new EquipmentGroup();
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
