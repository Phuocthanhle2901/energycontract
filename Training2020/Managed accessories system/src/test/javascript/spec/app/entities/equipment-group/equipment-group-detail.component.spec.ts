import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { EquipmentGroupDetailComponent } from 'app/entities/equipment-group/equipment-group-detail.component';
import { EquipmentGroup } from 'app/shared/model/equipment-group.model';

describe('Component Tests', () => {
  describe('EquipmentGroup Management Detail Component', () => {
    let comp: EquipmentGroupDetailComponent;
    let fixture: ComponentFixture<EquipmentGroupDetailComponent>;
    const route = ({ data: of({ equipmentGroup: new EquipmentGroup(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [EquipmentGroupDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(EquipmentGroupDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EquipmentGroupDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load equipmentGroup on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.equipmentGroup).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
