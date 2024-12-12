import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { ActionLogDetailComponent } from 'app/entities/action-log/action-log-detail.component';
import { ActionLog } from 'app/shared/model/action-log.model';

describe('Component Tests', () => {
  describe('ActionLog Management Detail Component', () => {
    let comp: ActionLogDetailComponent;
    let fixture: ComponentFixture<ActionLogDetailComponent>;
    const route = ({ data: of({ actionLog: new ActionLog(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [ActionLogDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ActionLogDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ActionLogDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load actionLog on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.actionLog).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
