import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEnrollment } from '../enrollment.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../enrollment.test-samples';

import { EnrollmentService, RestEnrollment } from './enrollment.service';

const requireRestSample: RestEnrollment = {
  ...sampleWithRequiredData,
  enrollmentDate: sampleWithRequiredData.enrollmentDate?.format(DATE_FORMAT),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Enrollment Service', () => {
  let service: EnrollmentService;
  let httpMock: HttpTestingController;
  let expectedResult: IEnrollment | IEnrollment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EnrollmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Enrollment', () => {
      const enrollment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(enrollment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Enrollment', () => {
      const enrollment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(enrollment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Enrollment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Enrollment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Enrollment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEnrollmentToCollectionIfMissing', () => {
      it('should add a Enrollment to an empty array', () => {
        const enrollment: IEnrollment = sampleWithRequiredData;
        expectedResult = service.addEnrollmentToCollectionIfMissing([], enrollment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(enrollment);
      });

      it('should not add a Enrollment to an array that contains it', () => {
        const enrollment: IEnrollment = sampleWithRequiredData;
        const enrollmentCollection: IEnrollment[] = [
          {
            ...enrollment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEnrollmentToCollectionIfMissing(enrollmentCollection, enrollment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Enrollment to an array that doesn't contain it", () => {
        const enrollment: IEnrollment = sampleWithRequiredData;
        const enrollmentCollection: IEnrollment[] = [sampleWithPartialData];
        expectedResult = service.addEnrollmentToCollectionIfMissing(enrollmentCollection, enrollment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(enrollment);
      });

      it('should add only unique Enrollment to an array', () => {
        const enrollmentArray: IEnrollment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const enrollmentCollection: IEnrollment[] = [sampleWithRequiredData];
        expectedResult = service.addEnrollmentToCollectionIfMissing(enrollmentCollection, ...enrollmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const enrollment: IEnrollment = sampleWithRequiredData;
        const enrollment2: IEnrollment = sampleWithPartialData;
        expectedResult = service.addEnrollmentToCollectionIfMissing([], enrollment, enrollment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(enrollment);
        expect(expectedResult).toContain(enrollment2);
      });

      it('should accept null and undefined values', () => {
        const enrollment: IEnrollment = sampleWithRequiredData;
        expectedResult = service.addEnrollmentToCollectionIfMissing([], null, enrollment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(enrollment);
      });

      it('should return initial array if no Enrollment is added', () => {
        const enrollmentCollection: IEnrollment[] = [sampleWithRequiredData];
        expectedResult = service.addEnrollmentToCollectionIfMissing(enrollmentCollection, undefined, null);
        expect(expectedResult).toEqual(enrollmentCollection);
      });
    });

    describe('compareEnrollment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEnrollment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEnrollment(entity1, entity2);
        const compareResult2 = service.compareEnrollment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEnrollment(entity1, entity2);
        const compareResult2 = service.compareEnrollment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEnrollment(entity1, entity2);
        const compareResult2 = service.compareEnrollment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
