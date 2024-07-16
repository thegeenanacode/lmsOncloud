import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGradebook } from '../gradebook.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../gradebook.test-samples';

import { GradebookService, RestGradebook } from './gradebook.service';

const requireRestSample: RestGradebook = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Gradebook Service', () => {
  let service: GradebookService;
  let httpMock: HttpTestingController;
  let expectedResult: IGradebook | IGradebook[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GradebookService);
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

    it('should create a Gradebook', () => {
      const gradebook = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gradebook).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Gradebook', () => {
      const gradebook = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gradebook).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Gradebook', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Gradebook', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Gradebook', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGradebookToCollectionIfMissing', () => {
      it('should add a Gradebook to an empty array', () => {
        const gradebook: IGradebook = sampleWithRequiredData;
        expectedResult = service.addGradebookToCollectionIfMissing([], gradebook);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gradebook);
      });

      it('should not add a Gradebook to an array that contains it', () => {
        const gradebook: IGradebook = sampleWithRequiredData;
        const gradebookCollection: IGradebook[] = [
          {
            ...gradebook,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGradebookToCollectionIfMissing(gradebookCollection, gradebook);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Gradebook to an array that doesn't contain it", () => {
        const gradebook: IGradebook = sampleWithRequiredData;
        const gradebookCollection: IGradebook[] = [sampleWithPartialData];
        expectedResult = service.addGradebookToCollectionIfMissing(gradebookCollection, gradebook);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gradebook);
      });

      it('should add only unique Gradebook to an array', () => {
        const gradebookArray: IGradebook[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gradebookCollection: IGradebook[] = [sampleWithRequiredData];
        expectedResult = service.addGradebookToCollectionIfMissing(gradebookCollection, ...gradebookArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gradebook: IGradebook = sampleWithRequiredData;
        const gradebook2: IGradebook = sampleWithPartialData;
        expectedResult = service.addGradebookToCollectionIfMissing([], gradebook, gradebook2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gradebook);
        expect(expectedResult).toContain(gradebook2);
      });

      it('should accept null and undefined values', () => {
        const gradebook: IGradebook = sampleWithRequiredData;
        expectedResult = service.addGradebookToCollectionIfMissing([], null, gradebook, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gradebook);
      });

      it('should return initial array if no Gradebook is added', () => {
        const gradebookCollection: IGradebook[] = [sampleWithRequiredData];
        expectedResult = service.addGradebookToCollectionIfMissing(gradebookCollection, undefined, null);
        expect(expectedResult).toEqual(gradebookCollection);
      });
    });

    describe('compareGradebook', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGradebook(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGradebook(entity1, entity2);
        const compareResult2 = service.compareGradebook(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGradebook(entity1, entity2);
        const compareResult2 = service.compareGradebook(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGradebook(entity1, entity2);
        const compareResult2 = service.compareGradebook(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
