import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { StatusTypeDetailComponent } from 'app/entities/status-type/status-type-detail.component';
import { StatusType } from 'app/shared/model/status-type.model';

describe('Component Tests', () => {
  describe('StatusType Management Detail Component', () => {
    let comp: StatusTypeDetailComponent;
    let fixture: ComponentFixture<StatusTypeDetailComponent>;
    const route = ({ data: of({ statusType: new StatusType(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [StatusTypeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(StatusTypeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(StatusTypeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load statusType on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.statusType).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
