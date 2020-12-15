import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { EquipmentGroupComponent } from 'app/entities/equipment-group/equipment-group.component';
import { EquipmentGroupService } from 'app/entities/equipment-group/equipment-group.service';
import { EquipmentGroup } from 'app/shared/model/equipment-group.model';

describe('Component Tests', () => {
  describe('EquipmentGroup Management Component', () => {
    let comp: EquipmentGroupComponent;
    let fixture: ComponentFixture<EquipmentGroupComponent>;
    let service: EquipmentGroupService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [EquipmentGroupComponent],
      })
        .overrideTemplate(EquipmentGroupComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EquipmentGroupComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EquipmentGroupService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new EquipmentGroup(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.equipmentGroups && comp.equipmentGroups[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
