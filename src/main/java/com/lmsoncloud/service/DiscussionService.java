package com.lmsoncloud.service;

import com.lmsoncloud.domain.Discussion;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.lmsoncloud.domain.Discussion}.
 */
public interface DiscussionService {
    /**
     * Save a discussion.
     *
     * @param discussion the entity to save.
     * @return the persisted entity.
     */
    Discussion save(Discussion discussion);

    /**
     * Updates a discussion.
     *
     * @param discussion the entity to update.
     * @return the persisted entity.
     */
    Discussion update(Discussion discussion);

    /**
     * Partially updates a discussion.
     *
     * @param discussion the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Discussion> partialUpdate(Discussion discussion);

    /**
     * Get all the discussions.
     *
     * @return the list of entities.
     */
    List<Discussion> findAll();

    /**
     * Get the "id" discussion.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Discussion> findOne(Long id);

    /**
     * Delete the "id" discussion.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
