import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { EquipmentComponent } from 'app/entities/equipment/equipment.component';
import { EquipmentService } from 'app/entities/equipment/equipment.service';
import { Equipment } from 'app/shared/model/equipment.model';

describe('Component Tests', () => {
  describe('Equipment Management Component', () => {
    let comp: EquipmentComponent;
    let fixture: ComponentFixture<EquipmentComponent>;
    let service: EquipmentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [EquipmentComponent],
      })
        .overrideTemplate(EquipmentComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EquipmentComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EquipmentService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Equipment(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.equipment && comp.equipment[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
