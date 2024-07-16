package com.lmsoncloud.web.rest;

import com.lmsoncloud.domain.Enrollment;
import com.lmsoncloud.repository.EnrollmentRepository;
import com.lmsoncloud.service.EnrollmentService;
import com.lmsoncloud.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.lmsoncloud.domain.Enrollment}.
 */
@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentResource {

    private static final Logger log = LoggerFactory.getLogger(EnrollmentResource.class);

    private static final String ENTITY_NAME = "enrollment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EnrollmentService enrollmentService;

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentResource(EnrollmentService enrollmentService, EnrollmentRepository enrollmentRepository) {
        this.enrollmentService = enrollmentService;
        this.enrollmentRepository = enrollmentRepository;
    }

    /**
     * {@code POST  /enrollments} : Create a new enrollment.
     *
     * @param enrollment the enrollment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new enrollment, or with status {@code 400 (Bad Request)} if the enrollment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Enrollment> createEnrollment(@RequestBody Enrollment enrollment) throws URISyntaxException {
        log.debug("REST request to save Enrollment : {}", enrollment);
        if (enrollment.getId() != null) {
            throw new BadRequestAlertException("A new enrollment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        enrollment = enrollmentService.save(enrollment);
        return ResponseEntity.created(new URI("/api/enrollments/" + enrollment.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, enrollment.getId().toString()))
            .body(enrollment);
    }

    /**
     * {@code PUT  /enrollments/:id} : Updates an existing enrollment.
     *
     * @param id the id of the enrollment to save.
     * @param enrollment the enrollment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated enrollment,
     * or with status {@code 400 (Bad Request)} if the enrollment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the enrollment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Enrollment> updateEnrollment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Enrollment enrollment
    ) throws URISyntaxException {
        log.debug("REST request to update Enrollment : {}, {}", id, enrollment);
        if (enrollment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, enrollment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!enrollmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        enrollment = enrollmentService.update(enrollment);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, enrollment.getId().toString()))
            .body(enrollment);
    }

    /**
     * {@code PATCH  /enrollments/:id} : Partial updates given fields of an existing enrollment, field will ignore if it is null
     *
     * @param id the id of the enrollment to save.
     * @param enrollment the enrollment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated enrollment,
     * or with status {@code 400 (Bad Request)} if the enrollment is not valid,
     * or with status {@code 404 (Not Found)} if the enrollment is not found,
     * or with status {@code 500 (Internal Server Error)} if the enrollment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Enrollment> partialUpdateEnrollment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Enrollment enrollment
    ) throws URISyntaxException {
        log.debug("REST request to partial update Enrollment partially : {}, {}", id, enrollment);
        if (enrollment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, enrollment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!enrollmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Enrollment> result = enrollmentService.partialUpdate(enrollment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, enrollment.getId().toString())
        );
    }

    /**
     * {@code GET  /enrollments} : get all the enrollments.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of enrollments in body.
     */
    @GetMapping("")
    public List<Enrollment> getAllEnrollments(@RequestParam(name = "filter", required = false) String filter) {
        if ("appuser-is-null".equals(filter)) {
            log.debug("REST request to get all Enrollments where appUser is null");
            return enrollmentService.findAllWhereAppUserIsNull();
        }
        log.debug("REST request to get all Enrollments");
        return enrollmentService.findAll();
    }

    /**
     * {@code GET  /enrollments/:id} : get the "id" enrollment.
     *
     * @param id the id of the enrollment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the enrollment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Enrollment> getEnrollment(@PathVariable("id") Long id) {
        log.debug("REST request to get Enrollment : {}", id);
        Optional<Enrollment> enrollment = enrollmentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(enrollment);
    }

    /**
     * {@code DELETE  /enrollments/:id} : delete the "id" enrollment.
     *
     * @param id the id of the enrollment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable("id") Long id) {
        log.debug("REST request to delete Enrollment : {}", id);
        enrollmentService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
