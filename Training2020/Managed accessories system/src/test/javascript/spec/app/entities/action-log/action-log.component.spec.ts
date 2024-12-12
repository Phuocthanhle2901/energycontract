import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { ActionLogComponent } from 'app/entities/action-log/action-log.component';
import { ActionLogService } from 'app/entities/action-log/action-log.service';
import { ActionLog } from 'app/shared/model/action-log.model';

describe('Component Tests', () => {
  describe('ActionLog Management Component', () => {
    let comp: ActionLogComponent;
    let fixture: ComponentFixture<ActionLogComponent>;
    let service: ActionLogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [ActionLogComponent],
      })
        .overrideTemplate(ActionLogComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActionLogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ActionLogService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ActionLog(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.actionLogs && comp.actionLogs[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
