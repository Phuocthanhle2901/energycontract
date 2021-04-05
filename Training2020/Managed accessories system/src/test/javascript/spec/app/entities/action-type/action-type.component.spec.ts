import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { ActionTypeComponent } from 'app/entities/action-type/action-type.component';
import { ActionTypeService } from 'app/entities/action-type/action-type.service';
import { ActionType } from 'app/shared/model/action-type.model';

describe('Component Tests', () => {
  describe('ActionType Management Component', () => {
    let comp: ActionTypeComponent;
    let fixture: ComponentFixture<ActionTypeComponent>;
    let service: ActionTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [ActionTypeComponent],
      })
        .overrideTemplate(ActionTypeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActionTypeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ActionTypeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ActionType(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.actionTypes && comp.actionTypes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
