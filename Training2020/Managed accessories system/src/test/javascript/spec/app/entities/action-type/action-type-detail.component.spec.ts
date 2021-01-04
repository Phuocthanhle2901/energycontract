import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { ActionTypeDetailComponent } from 'app/entities/action-type/action-type-detail.component';
import { ActionType } from 'app/shared/model/action-type.model';

describe('Component Tests', () => {
  describe('ActionType Management Detail Component', () => {
    let comp: ActionTypeDetailComponent;
    let fixture: ComponentFixture<ActionTypeDetailComponent>;
    const route = ({ data: of({ actionType: new ActionType(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [ActionTypeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ActionTypeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ActionTypeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load actionType on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.actionType).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
