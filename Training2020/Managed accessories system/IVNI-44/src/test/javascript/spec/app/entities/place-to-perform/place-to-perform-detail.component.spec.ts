import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ManagedAccessoriesSystemTestModule } from '../../../test.module';
import { PlaceToPerformDetailComponent } from 'app/entities/place-to-perform/place-to-perform-detail.component';
import { PlaceToPerform } from 'app/shared/model/place-to-perform.model';

describe('Component Tests', () => {
  describe('PlaceToPerform Management Detail Component', () => {
    let comp: PlaceToPerformDetailComponent;
    let fixture: ComponentFixture<PlaceToPerformDetailComponent>;
    const route = ({ data: of({ placeToPerform: new PlaceToPerform(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ManagedAccessoriesSystemTestModule],
        declarations: [PlaceToPerformDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(PlaceToPerformDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PlaceToPerformDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load placeToPerform on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.placeToPerform).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
