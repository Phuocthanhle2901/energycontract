import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { StatusLogService } from 'app/entities/status-log/status-log.service';
import { IStatusLog, StatusLog } from 'app/shared/model/status-log.model';

describe('Service Tests', () => {
  describe('StatusLog Service', () => {
    let injector: TestBed;
    let service: StatusLogService;
    let httpMock: HttpTestingController;
    let elemDefault: IStatusLog;
    let expectedResult: IStatusLog | IStatusLog[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(StatusLogService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new StatusLog(0, currentDate, 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            statusDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a StatusLog', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            statusDateTime: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            statusDateTime: currentDate,
          },
          returnedFromService
        );

        service.create(new StatusLog()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a StatusLog', () => {
        const returnedFromService = Object.assign(
          {
            statusDateTime: currentDate.format(DATE_TIME_FORMAT),
            note: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            statusDateTime: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of StatusLog', () => {
        const returnedFromService = Object.assign(
          {
            statusDateTime: currentDate.format(DATE_TIME_FORMAT),
            note: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            statusDateTime: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a StatusLog', () => {
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
