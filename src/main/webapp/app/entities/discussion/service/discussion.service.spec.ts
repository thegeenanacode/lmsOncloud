import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IDiscussion } from '../discussion.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../discussion.test-samples';

import { DiscussionService, RestDiscussion } from './discussion.service';

const requireRestSample: RestDiscussion = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Discussion Service', () => {
  let service: DiscussionService;
  let httpMock: HttpTestingController;
  let expectedResult: IDiscussion | IDiscussion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(DiscussionService);
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

    it('should create a Discussion', () => {
      const discussion = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(discussion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Discussion', () => {
      const discussion = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(discussion).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Discussion', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Discussion', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Discussion', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDiscussionToCollectionIfMissing', () => {
      it('should add a Discussion to an empty array', () => {
        const discussion: IDiscussion = sampleWithRequiredData;
        expectedResult = service.addDiscussionToCollectionIfMissing([], discussion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(discussion);
      });

      it('should not add a Discussion to an array that contains it', () => {
        const discussion: IDiscussion = sampleWithRequiredData;
        const discussionCollection: IDiscussion[] = [
          {
            ...discussion,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDiscussionToCollectionIfMissing(discussionCollection, discussion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Discussion to an array that doesn't contain it", () => {
        const discussion: IDiscussion = sampleWithRequiredData;
        const discussionCollection: IDiscussion[] = [sampleWithPartialData];
        expectedResult = service.addDiscussionToCollectionIfMissing(discussionCollection, discussion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(discussion);
      });

      it('should add only unique Discussion to an array', () => {
        const discussionArray: IDiscussion[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const discussionCollection: IDiscussion[] = [sampleWithRequiredData];
        expectedResult = service.addDiscussionToCollectionIfMissing(discussionCollection, ...discussionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const discussion: IDiscussion = sampleWithRequiredData;
        const discussion2: IDiscussion = sampleWithPartialData;
        expectedResult = service.addDiscussionToCollectionIfMissing([], discussion, discussion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(discussion);
        expect(expectedResult).toContain(discussion2);
      });

      it('should accept null and undefined values', () => {
        const discussion: IDiscussion = sampleWithRequiredData;
        expectedResult = service.addDiscussionToCollectionIfMissing([], null, discussion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(discussion);
      });

      it('should return initial array if no Discussion is added', () => {
        const discussionCollection: IDiscussion[] = [sampleWithRequiredData];
        expectedResult = service.addDiscussionToCollectionIfMissing(discussionCollection, undefined, null);
        expect(expectedResult).toEqual(discussionCollection);
      });
    });

    describe('compareDiscussion', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDiscussion(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDiscussion(entity1, entity2);
        const compareResult2 = service.compareDiscussion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDiscussion(entity1, entity2);
        const compareResult2 = service.compareDiscussion(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDiscussion(entity1, entity2);
        const compareResult2 = service.compareDiscussion(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
