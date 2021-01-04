import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { StatusLogDetailComponent } from 'app/entities/status-log/status-log-detail.component';
import { StatusLog } from 'app/shared/model/status-log.model';

describe('Component Tests', () => {
  describe('StatusLog Management Detail Component', () => {
    let comp: StatusLogDetailComponent;
    let fixture: ComponentFixture<StatusLogDetailComponent>;
    const route = ({ data: of({ statusLog: new StatusLog(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [StatusLogDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(StatusLogDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(StatusLogDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load statusLog on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.statusLog).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
