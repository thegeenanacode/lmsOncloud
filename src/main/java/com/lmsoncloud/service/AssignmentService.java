package com.lmsoncloud.service;

import com.lmsoncloud.domain.Assignment;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.lmsoncloud.domain.Assignment}.
 */
public interface AssignmentService {
    /**
     * Save a assignment.
     *
     * @param assignment the entity to save.
     * @return the persisted entity.
     */
    Assignment save(Assignment assignment);

    /**
     * Updates a assignment.
     *
     * @param assignment the entity to update.
     * @return the persisted entity.
     */
    Assignment update(Assignment assignment);

    /**
     * Partially updates a assignment.
     *
     * @param assignment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Assignment> partialUpdate(Assignment assignment);

    /**
     * Get all the assignments.
     *
     * @return the list of entities.
     */
    List<Assignment> findAll();

    /**
     * Get the "id" assignment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Assignment> findOne(Long id);

    /**
     * Delete the "id" assignment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
