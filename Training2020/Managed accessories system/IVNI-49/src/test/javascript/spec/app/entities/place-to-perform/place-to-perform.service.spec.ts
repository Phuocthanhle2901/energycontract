import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { PlaceToPerformService } from 'app/entities/place-to-perform/place-to-perform.service';
import { IPlaceToPerform, PlaceToPerform } from 'app/shared/model/place-to-perform.model';

describe('Service Tests', () => {
  describe('PlaceToPerform Service', () => {
    let injector: TestBed;
    let service: PlaceToPerformService;
    let httpMock: HttpTestingController;
    let elemDefault: IPlaceToPerform;
    let expectedResult: IPlaceToPerform | IPlaceToPerform[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(PlaceToPerformService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new PlaceToPerform(0, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', currentDate);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            representativeName: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a PlaceToPerform', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            representativeName: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            representativeName: currentDate,
          },
          returnedFromService
        );

        service.create(new PlaceToPerform()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a PlaceToPerform', () => {
        const returnedFromService = Object.assign(
          {
            placeName: 'BBBBBB',
            address: 'BBBBBB',
            phoneNumber: 'BBBBBB',
            email: 'BBBBBB',
            representativeName: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            representativeName: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of PlaceToPerform', () => {
        const returnedFromService = Object.assign(
          {
            placeName: 'BBBBBB',
            address: 'BBBBBB',
            phoneNumber: 'BBBBBB',
            email: 'BBBBBB',
            representativeName: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            representativeName: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a PlaceToPerform', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
