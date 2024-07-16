import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IContentLibrary } from '../content-library.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../content-library.test-samples';

import { ContentLibraryService, RestContentLibrary } from './content-library.service';

const requireRestSample: RestContentLibrary = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('ContentLibrary Service', () => {
  let service: ContentLibraryService;
  let httpMock: HttpTestingController;
  let expectedResult: IContentLibrary | IContentLibrary[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ContentLibraryService);
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

    it('should create a ContentLibrary', () => {
      const contentLibrary = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(contentLibrary).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ContentLibrary', () => {
      const contentLibrary = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(contentLibrary).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ContentLibrary', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ContentLibrary', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ContentLibrary', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addContentLibraryToCollectionIfMissing', () => {
      it('should add a ContentLibrary to an empty array', () => {
        const contentLibrary: IContentLibrary = sampleWithRequiredData;
        expectedResult = service.addContentLibraryToCollectionIfMissing([], contentLibrary);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(contentLibrary);
      });

      it('should not add a ContentLibrary to an array that contains it', () => {
        const contentLibrary: IContentLibrary = sampleWithRequiredData;
        const contentLibraryCollection: IContentLibrary[] = [
          {
            ...contentLibrary,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addContentLibraryToCollectionIfMissing(contentLibraryCollection, contentLibrary);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ContentLibrary to an array that doesn't contain it", () => {
        const contentLibrary: IContentLibrary = sampleWithRequiredData;
        const contentLibraryCollection: IContentLibrary[] = [sampleWithPartialData];
        expectedResult = service.addContentLibraryToCollectionIfMissing(contentLibraryCollection, contentLibrary);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(contentLibrary);
      });

      it('should add only unique ContentLibrary to an array', () => {
        const contentLibraryArray: IContentLibrary[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const contentLibraryCollection: IContentLibrary[] = [sampleWithRequiredData];
        expectedResult = service.addContentLibraryToCollectionIfMissing(contentLibraryCollection, ...contentLibraryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const contentLibrary: IContentLibrary = sampleWithRequiredData;
        const contentLibrary2: IContentLibrary = sampleWithPartialData;
        expectedResult = service.addContentLibraryToCollectionIfMissing([], contentLibrary, contentLibrary2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(contentLibrary);
        expect(expectedResult).toContain(contentLibrary2);
      });

      it('should accept null and undefined values', () => {
        const contentLibrary: IContentLibrary = sampleWithRequiredData;
        expectedResult = service.addContentLibraryToCollectionIfMissing([], null, contentLibrary, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(contentLibrary);
      });

      it('should return initial array if no ContentLibrary is added', () => {
        const contentLibraryCollection: IContentLibrary[] = [sampleWithRequiredData];
        expectedResult = service.addContentLibraryToCollectionIfMissing(contentLibraryCollection, undefined, null);
        expect(expectedResult).toEqual(contentLibraryCollection);
      });
    });

    describe('compareContentLibrary', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareContentLibrary(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareContentLibrary(entity1, entity2);
        const compareResult2 = service.compareContentLibrary(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareContentLibrary(entity1, entity2);
        const compareResult2 = service.compareContentLibrary(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareContentLibrary(entity1, entity2);
        const compareResult2 = service.compareContentLibrary(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
