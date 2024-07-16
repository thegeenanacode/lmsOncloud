package com.lmsoncloud.service;

import com.lmsoncloud.domain.ContentLibrary;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.lmsoncloud.domain.ContentLibrary}.
 */
public interface ContentLibraryService {
    /**
     * Save a contentLibrary.
     *
     * @param contentLibrary the entity to save.
     * @return the persisted entity.
     */
    ContentLibrary save(ContentLibrary contentLibrary);

    /**
     * Updates a contentLibrary.
     *
     * @param contentLibrary the entity to update.
     * @return the persisted entity.
     */
    ContentLibrary update(ContentLibrary contentLibrary);

    /**
     * Partially updates a contentLibrary.
     *
     * @param contentLibrary the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ContentLibrary> partialUpdate(ContentLibrary contentLibrary);

    /**
     * Get all the contentLibraries.
     *
     * @return the list of entities.
     */
    List<ContentLibrary> findAll();

    /**
     * Get the "id" contentLibrary.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ContentLibrary> findOne(Long id);

    /**
     * Delete the "id" contentLibrary.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
