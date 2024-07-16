package com.lmsoncloud.service;

import com.lmsoncloud.domain.Gradebook;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.lmsoncloud.domain.Gradebook}.
 */
public interface GradebookService {
    /**
     * Save a gradebook.
     *
     * @param gradebook the entity to save.
     * @return the persisted entity.
     */
    Gradebook save(Gradebook gradebook);

    /**
     * Updates a gradebook.
     *
     * @param gradebook the entity to update.
     * @return the persisted entity.
     */
    Gradebook update(Gradebook gradebook);

    /**
     * Partially updates a gradebook.
     *
     * @param gradebook the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Gradebook> partialUpdate(Gradebook gradebook);

    /**
     * Get all the gradebooks.
     *
     * @return the list of entities.
     */
    List<Gradebook> findAll();

    /**
     * Get the "id" gradebook.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Gradebook> findOne(Long id);

    /**
     * Delete the "id" gradebook.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
