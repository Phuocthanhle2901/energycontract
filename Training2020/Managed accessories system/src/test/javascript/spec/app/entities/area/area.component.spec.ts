import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { AreaComponent } from 'app/entities/area/area.component';
import { AreaService } from 'app/entities/area/area.service';
import { Area } from 'app/shared/model/area.model';

describe('Component Tests', () => {
  describe('Area Management Component', () => {
    let comp: AreaComponent;
    let fixture: ComponentFixture<AreaComponent>;
    let service: AreaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [AreaComponent],
      })
        .overrideTemplate(AreaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AreaComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AreaService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Area(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.areas && comp.areas[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
