package com.lmsoncloud.service;

import com.lmsoncloud.domain.Announcement;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.lmsoncloud.domain.Announcement}.
 */
public interface AnnouncementService {
    /**
     * Save a announcement.
     *
     * @param announcement the entity to save.
     * @return the persisted entity.
     */
    Announcement save(Announcement announcement);

    /**
     * Updates a announcement.
     *
     * @param announcement the entity to update.
     * @return the persisted entity.
     */
    Announcement update(Announcement announcement);

    /**
     * Partially updates a announcement.
     *
     * @param announcement the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Announcement> partialUpdate(Announcement announcement);

    /**
     * Get all the announcements.
     *
     * @return the list of entities.
     */
    List<Announcement> findAll();

    /**
     * Get the "id" announcement.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Announcement> findOne(Long id);

    /**
     * Delete the "id" announcement.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
