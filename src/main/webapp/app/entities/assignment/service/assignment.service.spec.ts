import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IAssignment } from '../assignment.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../assignment.test-samples';

import { AssignmentService, RestAssignment } from './assignment.service';

const requireRestSample: RestAssignment = {
  ...sampleWithRequiredData,
  dueDate: sampleWithRequiredData.dueDate?.format(DATE_FORMAT),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Assignment Service', () => {
  let service: AssignmentService;
  let httpMock: HttpTestingController;
  let expectedResult: IAssignment | IAssignment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AssignmentService);
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

    it('should create a Assignment', () => {
      const assignment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(assignment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Assignment', () => {
      const assignment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(assignment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Assignment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Assignment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Assignment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAssignmentToCollectionIfMissing', () => {
      it('should add a Assignment to an empty array', () => {
        const assignment: IAssignment = sampleWithRequiredData;
        expectedResult = service.addAssignmentToCollectionIfMissing([], assignment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(assignment);
      });

      it('should not add a Assignment to an array that contains it', () => {
        const assignment: IAssignment = sampleWithRequiredData;
        const assignmentCollection: IAssignment[] = [
          {
            ...assignment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAssignmentToCollectionIfMissing(assignmentCollection, assignment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Assignment to an array that doesn't contain it", () => {
        const assignment: IAssignment = sampleWithRequiredData;
        const assignmentCollection: IAssignment[] = [sampleWithPartialData];
        expectedResult = service.addAssignmentToCollectionIfMissing(assignmentCollection, assignment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(assignment);
      });

      it('should add only unique Assignment to an array', () => {
        const assignmentArray: IAssignment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const assignmentCollection: IAssignment[] = [sampleWithRequiredData];
        expectedResult = service.addAssignmentToCollectionIfMissing(assignmentCollection, ...assignmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const assignment: IAssignment = sampleWithRequiredData;
        const assignment2: IAssignment = sampleWithPartialData;
        expectedResult = service.addAssignmentToCollectionIfMissing([], assignment, assignment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(assignment);
        expect(expectedResult).toContain(assignment2);
      });

      it('should accept null and undefined values', () => {
        const assignment: IAssignment = sampleWithRequiredData;
        expectedResult = service.addAssignmentToCollectionIfMissing([], null, assignment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(assignment);
      });

      it('should return initial array if no Assignment is added', () => {
        const assignmentCollection: IAssignment[] = [sampleWithRequiredData];
        expectedResult = service.addAssignmentToCollectionIfMissing(assignmentCollection, undefined, null);
        expect(expectedResult).toEqual(assignmentCollection);
      });
    });

    describe('compareAssignment', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAssignment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAssignment(entity1, entity2);
        const compareResult2 = service.compareAssignment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAssignment(entity1, entity2);
        const compareResult2 = service.compareAssignment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAssignment(entity1, entity2);
        const compareResult2 = service.compareAssignment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
