package com.lmsoncloud.web.rest;

import com.lmsoncloud.domain.Gradebook;
import com.lmsoncloud.repository.GradebookRepository;
import com.lmsoncloud.service.GradebookService;
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
 * REST controller for managing {@link com.lmsoncloud.domain.Gradebook}.
 */
@RestController
@RequestMapping("/api/gradebooks")
public class GradebookResource {

    private static final Logger log = LoggerFactory.getLogger(GradebookResource.class);

    private static final String ENTITY_NAME = "gradebook";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GradebookService gradebookService;

    private final GradebookRepository gradebookRepository;

    public GradebookResource(GradebookService gradebookService, GradebookRepository gradebookRepository) {
        this.gradebookService = gradebookService;
        this.gradebookRepository = gradebookRepository;
    }

    /**
     * {@code POST  /gradebooks} : Create a new gradebook.
     *
     * @param gradebook the gradebook to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gradebook, or with status {@code 400 (Bad Request)} if the gradebook has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Gradebook> createGradebook(@Valid @RequestBody Gradebook gradebook) throws URISyntaxException {
        log.debug("REST request to save Gradebook : {}", gradebook);
        if (gradebook.getId() != null) {
            throw new BadRequestAlertException("A new gradebook cannot already have an ID", ENTITY_NAME, "idexists");
        }
        gradebook = gradebookService.save(gradebook);
        return ResponseEntity.created(new URI("/api/gradebooks/" + gradebook.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, gradebook.getId().toString()))
            .body(gradebook);
    }

    /**
     * {@code PUT  /gradebooks/:id} : Updates an existing gradebook.
     *
     * @param id the id of the gradebook to save.
     * @param gradebook the gradebook to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gradebook,
     * or with status {@code 400 (Bad Request)} if the gradebook is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gradebook couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Gradebook> updateGradebook(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Gradebook gradebook
    ) throws URISyntaxException {
        log.debug("REST request to update Gradebook : {}, {}", id, gradebook);
        if (gradebook.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gradebook.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gradebookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        gradebook = gradebookService.update(gradebook);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gradebook.getId().toString()))
            .body(gradebook);
    }

    /**
     * {@code PATCH  /gradebooks/:id} : Partial updates given fields of an existing gradebook, field will ignore if it is null
     *
     * @param id the id of the gradebook to save.
     * @param gradebook the gradebook to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gradebook,
     * or with status {@code 400 (Bad Request)} if the gradebook is not valid,
     * or with status {@code 404 (Not Found)} if the gradebook is not found,
     * or with status {@code 500 (Internal Server Error)} if the gradebook couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Gradebook> partialUpdateGradebook(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Gradebook gradebook
    ) throws URISyntaxException {
        log.debug("REST request to partial update Gradebook partially : {}, {}", id, gradebook);
        if (gradebook.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gradebook.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gradebookRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Gradebook> result = gradebookService.partialUpdate(gradebook);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gradebook.getId().toString())
        );
    }

    /**
     * {@code GET  /gradebooks} : get all the gradebooks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gradebooks in body.
     */
    @GetMapping("")
    public List<Gradebook> getAllGradebooks() {
        log.debug("REST request to get all Gradebooks");
        return gradebookService.findAll();
    }

    /**
     * {@code GET  /gradebooks/:id} : get the "id" gradebook.
     *
     * @param id the id of the gradebook to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gradebook, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Gradebook> getGradebook(@PathVariable("id") Long id) {
        log.debug("REST request to get Gradebook : {}", id);
        Optional<Gradebook> gradebook = gradebookService.findOne(id);
        return ResponseUtil.wrapOrNotFound(gradebook);
    }

    /**
     * {@code DELETE  /gradebooks/:id} : delete the "id" gradebook.
     *
     * @param id the id of the gradebook to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGradebook(@PathVariable("id") Long id) {
        log.debug("REST request to delete Gradebook : {}", id);
        gradebookService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
