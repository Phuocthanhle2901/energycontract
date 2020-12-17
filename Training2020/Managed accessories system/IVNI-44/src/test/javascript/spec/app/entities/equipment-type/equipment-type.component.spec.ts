import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { EquipmentTypeComponent } from 'app/entities/equipment-type/equipment-type.component';
import { EquipmentTypeService } from 'app/entities/equipment-type/equipment-type.service';
import { EquipmentType } from 'app/shared/model/equipment-type.model';

describe('Component Tests', () => {
  describe('EquipmentType Management Component', () => {
    let comp: EquipmentTypeComponent;
    let fixture: ComponentFixture<EquipmentTypeComponent>;
    let service: EquipmentTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [EquipmentTypeComponent],
      })
        .overrideTemplate(EquipmentTypeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EquipmentTypeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EquipmentTypeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new EquipmentType(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.equipmentTypes && comp.equipmentTypes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
