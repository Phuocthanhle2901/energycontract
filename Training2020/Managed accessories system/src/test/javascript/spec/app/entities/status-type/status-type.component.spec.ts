import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { StatusTypeComponent } from 'app/entities/status-type/status-type.component';
import { StatusTypeService } from 'app/entities/status-type/status-type.service';
import { StatusType } from 'app/shared/model/status-type.model';

describe('Component Tests', () => {
  describe('StatusType Management Component', () => {
    let comp: StatusTypeComponent;
    let fixture: ComponentFixture<StatusTypeComponent>;
    let service: StatusTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [StatusTypeComponent],
      })
        .overrideTemplate(StatusTypeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StatusTypeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(StatusTypeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new StatusType(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.statusTypes && comp.statusTypes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
