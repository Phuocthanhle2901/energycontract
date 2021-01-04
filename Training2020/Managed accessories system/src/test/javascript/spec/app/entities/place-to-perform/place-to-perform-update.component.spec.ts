import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { PlaceToPerformUpdateComponent } from 'app/entities/place-to-perform/place-to-perform-update.component';
import { PlaceToPerformService } from 'app/entities/place-to-perform/place-to-perform.service';
import { PlaceToPerform } from 'app/shared/model/place-to-perform.model';

describe('Component Tests', () => {
  describe('PlaceToPerform Management Update Component', () => {
    let comp: PlaceToPerformUpdateComponent;
    let fixture: ComponentFixture<PlaceToPerformUpdateComponent>;
    let service: PlaceToPerformService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [PlaceToPerformUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(PlaceToPerformUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PlaceToPerformUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PlaceToPerformService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new PlaceToPerform(123);
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
        const entity = new PlaceToPerform();
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
