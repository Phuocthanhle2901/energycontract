import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { PlaceToPerformComponent } from 'app/entities/place-to-perform/place-to-perform.component';
import { PlaceToPerformService } from 'app/entities/place-to-perform/place-to-perform.service';
import { PlaceToPerform } from 'app/shared/model/place-to-perform.model';

describe('Component Tests', () => {
  describe('PlaceToPerform Management Component', () => {
    let comp: PlaceToPerformComponent;
    let fixture: ComponentFixture<PlaceToPerformComponent>;
    let service: PlaceToPerformService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [PlaceToPerformComponent],
      })
        .overrideTemplate(PlaceToPerformComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PlaceToPerformComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PlaceToPerformService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new PlaceToPerform(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.placeToPerforms && comp.placeToPerforms[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
