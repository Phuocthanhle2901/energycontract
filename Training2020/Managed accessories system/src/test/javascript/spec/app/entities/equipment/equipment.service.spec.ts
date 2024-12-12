import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { EquipmentService } from 'app/entities/equipment/equipment.service';
import { IEquipment, Equipment } from 'app/shared/model/equipment.model';

describe('Service Tests', () => {
  describe('Equipment Service', () => {
    let injector: TestBed;
    let service: EquipmentService;
    let httpMock: HttpTestingController;
    let elemDefault: IEquipment;
    let expectedResult: IEquipment | IEquipment[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(EquipmentService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Equipment(0, currentDate, 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            purchaseDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Equipment', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            purchaseDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            purchaseDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Equipment()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Equipment', () => {
        const returnedFromService = Object.assign(
          {
            purchaseDate: currentDate.format(DATE_TIME_FORMAT),
            equipmentName: 'BBBBBB',
            technicalFeatures: 'BBBBBB',
            serialNumber: 'BBBBBB',
            note: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            purchaseDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Equipment', () => {
        const returnedFromService = Object.assign(
          {
            purchaseDate: currentDate.format(DATE_TIME_FORMAT),
            equipmentName: 'BBBBBB',
            technicalFeatures: 'BBBBBB',
            serialNumber: 'BBBBBB',
            note: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            purchaseDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Equipment', () => {
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
