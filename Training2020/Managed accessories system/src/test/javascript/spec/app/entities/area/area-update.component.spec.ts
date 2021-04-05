import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { AreaUpdateComponent } from 'app/entities/area/area-update.component';
import { AreaService } from 'app/entities/area/area.service';
import { Area } from 'app/shared/model/area.model';

describe('Component Tests', () => {
  describe('Area Management Update Component', () => {
    let comp: AreaUpdateComponent;
    let fixture: ComponentFixture<AreaUpdateComponent>;
    let service: AreaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [AreaUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(AreaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AreaUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AreaService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Area(123);
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
        const entity = new Area();
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
