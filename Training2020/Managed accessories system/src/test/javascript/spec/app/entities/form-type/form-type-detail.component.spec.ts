import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { FormTypeDetailComponent } from 'app/entities/form-type/form-type-detail.component';
import { FormType } from 'app/shared/model/form-type.model';

describe('Component Tests', () => {
  describe('FormType Management Detail Component', () => {
    let comp: FormTypeDetailComponent;
    let fixture: ComponentFixture<FormTypeDetailComponent>;
    const route = ({ data: of({ formType: new FormType(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [FormTypeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(FormTypeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FormTypeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load formType on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.formType).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
