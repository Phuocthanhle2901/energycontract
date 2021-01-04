import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { StatusLogComponent } from 'app/entities/status-log/status-log.component';
import { StatusLogService } from 'app/entities/status-log/status-log.service';
import { StatusLog } from 'app/shared/model/status-log.model';

describe('Component Tests', () => {
  describe('StatusLog Management Component', () => {
    let comp: StatusLogComponent;
    let fixture: ComponentFixture<StatusLogComponent>;
    let service: StatusLogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [StatusLogComponent],
      })
        .overrideTemplate(StatusLogComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StatusLogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(StatusLogService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new StatusLog(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.statusLogs && comp.statusLogs[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
