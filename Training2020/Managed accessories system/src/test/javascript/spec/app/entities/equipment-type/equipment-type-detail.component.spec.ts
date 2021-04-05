import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { EquipmentTypeDetailComponent } from 'app/entities/equipment-type/equipment-type-detail.component';
import { EquipmentType } from 'app/shared/model/equipment-type.model';

describe('Component Tests', () => {
  describe('EquipmentType Management Detail Component', () => {
    let comp: EquipmentTypeDetailComponent;
    let fixture: ComponentFixture<EquipmentTypeDetailComponent>;
    const route = ({ data: of({ equipmentType: new EquipmentType(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [EquipmentTypeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(EquipmentTypeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EquipmentTypeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load equipmentType on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.equipmentType).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
