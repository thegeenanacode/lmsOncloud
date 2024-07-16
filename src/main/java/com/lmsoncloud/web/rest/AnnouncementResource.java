package com.lmsoncloud.web.rest;

import com.lmsoncloud.domain.Announcement;
import com.lmsoncloud.repository.AnnouncementRepository;
import com.lmsoncloud.service.AnnouncementService;
import com.lmsoncloud.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.lmsoncloud.domain.Announcement}.
 */
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementResource {

    private static final Logger log = LoggerFactory.getLogger(AnnouncementResource.class);

    private static final String ENTITY_NAME = "announcement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnnouncementService announcementService;

    private final AnnouncementRepository announcementRepository;

    public AnnouncementResource(AnnouncementService announcementService, AnnouncementRepository announcementRepository) {
        this.announcementService = announcementService;
        this.announcementRepository = announcementRepository;
    }

    /**
     * {@code POST  /announcements} : Create a new announcement.
     *
     * @param announcement the announcement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new announcement, or with status {@code 400 (Bad Request)} if the announcement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Announcement> createAnnouncement(@Valid @RequestBody Announcement announcement) throws URISyntaxException {
        log.debug("REST request to save Announcement : {}", announcement);
        if (announcement.getId() != null) {
            throw new BadRequestAlertException("A new announcement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        announcement = announcementService.save(announcement);
        return ResponseEntity.created(new URI("/api/announcements/" + announcement.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, announcement.getId().toString()))
            .body(announcement);
    }

    /**
     * {@code PUT  /announcements/:id} : Updates an existing announcement.
     *
     * @param id the id of the announcement to save.
     * @param announcement the announcement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated announcement,
     * or with status {@code 400 (Bad Request)} if the announcement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the announcement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Announcement> updateAnnouncement(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Announcement announcement
    ) throws URISyntaxException {
        log.debug("REST request to update Announcement : {}, {}", id, announcement);
        if (announcement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, announcement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!announcementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        announcement = announcementService.update(announcement);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, announcement.getId().toString()))
            .body(announcement);
    }

    /**
     * {@code PATCH  /announcements/:id} : Partial updates given fields of an existing announcement, field will ignore if it is null
     *
     * @param id the id of the announcement to save.
     * @param announcement the announcement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated announcement,
     * or with status {@code 400 (Bad Request)} if the announcement is not valid,
     * or with status {@code 404 (Not Found)} if the announcement is not found,
     * or with status {@code 500 (Internal Server Error)} if the announcement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Announcement> partialUpdateAnnouncement(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Announcement announcement
    ) throws URISyntaxException {
        log.debug("REST request to partial update Announcement partially : {}, {}", id, announcement);
        if (announcement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, announcement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!announcementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Announcement> result = announcementService.partialUpdate(announcement);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, announcement.getId().toString())
        );
    }

    /**
     * {@code GET  /announcements} : get all the announcements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of announcements in body.
     */
    @GetMapping("")
    public List<Announcement> getAllAnnouncements() {
        log.debug("REST request to get all Announcements");
        return announcementService.findAll();
    }

    /**
     * {@code GET  /announcements/:id} : get the "id" announcement.
     *
     * @param id the id of the announcement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the announcement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Announcement> getAnnouncement(@PathVariable("id") Long id) {
        log.debug("REST request to get Announcement : {}", id);
        Optional<Announcement> announcement = announcementService.findOne(id);
        return ResponseUtil.wrapOrNotFound(announcement);
    }

    /**
     * {@code DELETE  /announcements/:id} : delete the "id" announcement.
     *
     * @param id the id of the announcement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable("id") Long id) {
        log.debug("REST request to delete Announcement : {}", id);
        announcementService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
