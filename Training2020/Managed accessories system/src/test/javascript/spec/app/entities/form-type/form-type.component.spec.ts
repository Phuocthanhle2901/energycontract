import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { FormTypeComponent } from 'app/entities/form-type/form-type.component';
import { FormTypeService } from 'app/entities/form-type/form-type.service';
import { FormType } from 'app/shared/model/form-type.model';

describe('Component Tests', () => {
  describe('FormType Management Component', () => {
    let comp: FormTypeComponent;
    let fixture: ComponentFixture<FormTypeComponent>;
    let service: FormTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [FormTypeComponent],
      })
        .overrideTemplate(FormTypeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FormTypeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(FormTypeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new FormType(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.formTypes && comp.formTypes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
