package com.lmsoncloud.web.rest;

import com.lmsoncloud.domain.ContentLibrary;
import com.lmsoncloud.repository.ContentLibraryRepository;
import com.lmsoncloud.service.ContentLibraryService;
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
 * REST controller for managing {@link com.lmsoncloud.domain.ContentLibrary}.
 */
@RestController
@RequestMapping("/api/content-libraries")
public class ContentLibraryResource {

    private static final Logger log = LoggerFactory.getLogger(ContentLibraryResource.class);

    private static final String ENTITY_NAME = "contentLibrary";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContentLibraryService contentLibraryService;

    private final ContentLibraryRepository contentLibraryRepository;

    public ContentLibraryResource(ContentLibraryService contentLibraryService, ContentLibraryRepository contentLibraryRepository) {
        this.contentLibraryService = contentLibraryService;
        this.contentLibraryRepository = contentLibraryRepository;
    }

    /**
     * {@code POST  /content-libraries} : Create a new contentLibrary.
     *
     * @param contentLibrary the contentLibrary to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new contentLibrary, or with status {@code 400 (Bad Request)} if the contentLibrary has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ContentLibrary> createContentLibrary(@Valid @RequestBody ContentLibrary contentLibrary)
        throws URISyntaxException {
        log.debug("REST request to save ContentLibrary : {}", contentLibrary);
        if (contentLibrary.getId() != null) {
            throw new BadRequestAlertException("A new contentLibrary cannot already have an ID", ENTITY_NAME, "idexists");
        }
        contentLibrary = contentLibraryService.save(contentLibrary);
        return ResponseEntity.created(new URI("/api/content-libraries/" + contentLibrary.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, contentLibrary.getId().toString()))
            .body(contentLibrary);
    }

    /**
     * {@code PUT  /content-libraries/:id} : Updates an existing contentLibrary.
     *
     * @param id the id of the contentLibrary to save.
     * @param contentLibrary the contentLibrary to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contentLibrary,
     * or with status {@code 400 (Bad Request)} if the contentLibrary is not valid,
     * or with status {@code 500 (Internal Server Error)} if the contentLibrary couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ContentLibrary> updateContentLibrary(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ContentLibrary contentLibrary
    ) throws URISyntaxException {
        log.debug("REST request to update ContentLibrary : {}, {}", id, contentLibrary);
        if (contentLibrary.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contentLibrary.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contentLibraryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        contentLibrary = contentLibraryService.update(contentLibrary);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contentLibrary.getId().toString()))
            .body(contentLibrary);
    }

    /**
     * {@code PATCH  /content-libraries/:id} : Partial updates given fields of an existing contentLibrary, field will ignore if it is null
     *
     * @param id the id of the contentLibrary to save.
     * @param contentLibrary the contentLibrary to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contentLibrary,
     * or with status {@code 400 (Bad Request)} if the contentLibrary is not valid,
     * or with status {@code 404 (Not Found)} if the contentLibrary is not found,
     * or with status {@code 500 (Internal Server Error)} if the contentLibrary couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ContentLibrary> partialUpdateContentLibrary(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ContentLibrary contentLibrary
    ) throws URISyntaxException {
        log.debug("REST request to partial update ContentLibrary partially : {}, {}", id, contentLibrary);
        if (contentLibrary.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contentLibrary.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contentLibraryRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ContentLibrary> result = contentLibraryService.partialUpdate(contentLibrary);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contentLibrary.getId().toString())
        );
    }

    /**
     * {@code GET  /content-libraries} : get all the contentLibraries.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contentLibraries in body.
     */
    @GetMapping("")
    public List<ContentLibrary> getAllContentLibraries() {
        log.debug("REST request to get all ContentLibraries");
        return contentLibraryService.findAll();
    }

    /**
     * {@code GET  /content-libraries/:id} : get the "id" contentLibrary.
     *
     * @param id the id of the contentLibrary to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contentLibrary, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ContentLibrary> getContentLibrary(@PathVariable("id") Long id) {
        log.debug("REST request to get ContentLibrary : {}", id);
        Optional<ContentLibrary> contentLibrary = contentLibraryService.findOne(id);
        return ResponseUtil.wrapOrNotFound(contentLibrary);
    }

    /**
     * {@code DELETE  /content-libraries/:id} : delete the "id" contentLibrary.
     *
     * @param id the id of the contentLibrary to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContentLibrary(@PathVariable("id") Long id) {
        log.debug("REST request to delete ContentLibrary : {}", id);
        contentLibraryService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
