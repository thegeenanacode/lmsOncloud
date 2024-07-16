package com.lmsoncloud.web.rest;

import com.lmsoncloud.domain.Discussion;
import com.lmsoncloud.repository.DiscussionRepository;
import com.lmsoncloud.service.DiscussionService;
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
 * REST controller for managing {@link com.lmsoncloud.domain.Discussion}.
 */
@RestController
@RequestMapping("/api/discussions")
public class DiscussionResource {

    private static final Logger log = LoggerFactory.getLogger(DiscussionResource.class);

    private static final String ENTITY_NAME = "discussion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DiscussionService discussionService;

    private final DiscussionRepository discussionRepository;

    public DiscussionResource(DiscussionService discussionService, DiscussionRepository discussionRepository) {
        this.discussionService = discussionService;
        this.discussionRepository = discussionRepository;
    }

    /**
     * {@code POST  /discussions} : Create a new discussion.
     *
     * @param discussion the discussion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new discussion, or with status {@code 400 (Bad Request)} if the discussion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Discussion> createDiscussion(@Valid @RequestBody Discussion discussion) throws URISyntaxException {
        log.debug("REST request to save Discussion : {}", discussion);
        if (discussion.getId() != null) {
            throw new BadRequestAlertException("A new discussion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        discussion = discussionService.save(discussion);
        return ResponseEntity.created(new URI("/api/discussions/" + discussion.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, discussion.getId().toString()))
            .body(discussion);
    }

    /**
     * {@code PUT  /discussions/:id} : Updates an existing discussion.
     *
     * @param id the id of the discussion to save.
     * @param discussion the discussion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated discussion,
     * or with status {@code 400 (Bad Request)} if the discussion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the discussion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Discussion> updateDiscussion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Discussion discussion
    ) throws URISyntaxException {
        log.debug("REST request to update Discussion : {}, {}", id, discussion);
        if (discussion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, discussion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!discussionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        discussion = discussionService.update(discussion);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, discussion.getId().toString()))
            .body(discussion);
    }

    /**
     * {@code PATCH  /discussions/:id} : Partial updates given fields of an existing discussion, field will ignore if it is null
     *
     * @param id the id of the discussion to save.
     * @param discussion the discussion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated discussion,
     * or with status {@code 400 (Bad Request)} if the discussion is not valid,
     * or with status {@code 404 (Not Found)} if the discussion is not found,
     * or with status {@code 500 (Internal Server Error)} if the discussion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Discussion> partialUpdateDiscussion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Discussion discussion
    ) throws URISyntaxException {
        log.debug("REST request to partial update Discussion partially : {}, {}", id, discussion);
        if (discussion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, discussion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!discussionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Discussion> result = discussionService.partialUpdate(discussion);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, discussion.getId().toString())
        );
    }

    /**
     * {@code GET  /discussions} : get all the discussions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of discussions in body.
     */
    @GetMapping("")
    public List<Discussion> getAllDiscussions() {
        log.debug("REST request to get all Discussions");
        return discussionService.findAll();
    }

    /**
     * {@code GET  /discussions/:id} : get the "id" discussion.
     *
     * @param id the id of the discussion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the discussion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Discussion> getDiscussion(@PathVariable("id") Long id) {
        log.debug("REST request to get Discussion : {}", id);
        Optional<Discussion> discussion = discussionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(discussion);
    }

    /**
     * {@code DELETE  /discussions/:id} : delete the "id" discussion.
     *
     * @param id the id of the discussion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscussion(@PathVariable("id") Long id) {
        log.debug("REST request to delete Discussion : {}", id);
        discussionService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
