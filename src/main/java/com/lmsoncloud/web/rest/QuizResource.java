package com.lmsoncloud.web.rest;

import com.lmsoncloud.domain.Quiz;
import com.lmsoncloud.repository.QuizRepository;
import com.lmsoncloud.service.QuizService;
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
 * REST controller for managing {@link com.lmsoncloud.domain.Quiz}.
 */
@RestController
@RequestMapping("/api/quizzes")
public class QuizResource {

    private static final Logger log = LoggerFactory.getLogger(QuizResource.class);

    private static final String ENTITY_NAME = "quiz";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuizService quizService;

    private final QuizRepository quizRepository;

    public QuizResource(QuizService quizService, QuizRepository quizRepository) {
        this.quizService = quizService;
        this.quizRepository = quizRepository;
    }

    /**
     * {@code POST  /quizzes} : Create a new quiz.
     *
     * @param quiz the quiz to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new quiz, or with status {@code 400 (Bad Request)} if the quiz has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Quiz> createQuiz(@Valid @RequestBody Quiz quiz) throws URISyntaxException {
        log.debug("REST request to save Quiz : {}", quiz);
        if (quiz.getId() != null) {
            throw new BadRequestAlertException("A new quiz cannot already have an ID", ENTITY_NAME, "idexists");
        }
        quiz = quizService.save(quiz);
        return ResponseEntity.created(new URI("/api/quizzes/" + quiz.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, quiz.getId().toString()))
            .body(quiz);
    }

    /**
     * {@code PUT  /quizzes/:id} : Updates an existing quiz.
     *
     * @param id the id of the quiz to save.
     * @param quiz the quiz to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated quiz,
     * or with status {@code 400 (Bad Request)} if the quiz is not valid,
     * or with status {@code 500 (Internal Server Error)} if the quiz couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Quiz quiz)
        throws URISyntaxException {
        log.debug("REST request to update Quiz : {}, {}", id, quiz);
        if (quiz.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, quiz.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!quizRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        quiz = quizService.update(quiz);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, quiz.getId().toString()))
            .body(quiz);
    }

    /**
     * {@code PATCH  /quizzes/:id} : Partial updates given fields of an existing quiz, field will ignore if it is null
     *
     * @param id the id of the quiz to save.
     * @param quiz the quiz to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated quiz,
     * or with status {@code 400 (Bad Request)} if the quiz is not valid,
     * or with status {@code 404 (Not Found)} if the quiz is not found,
     * or with status {@code 500 (Internal Server Error)} if the quiz couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Quiz> partialUpdateQuiz(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Quiz quiz
    ) throws URISyntaxException {
        log.debug("REST request to partial update Quiz partially : {}, {}", id, quiz);
        if (quiz.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, quiz.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!quizRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Quiz> result = quizService.partialUpdate(quiz);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, quiz.getId().toString())
        );
    }

    /**
     * {@code GET  /quizzes} : get all the quizzes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of quizzes in body.
     */
    @GetMapping("")
    public List<Quiz> getAllQuizzes() {
        log.debug("REST request to get all Quizzes");
        return quizService.findAll();
    }

    /**
     * {@code GET  /quizzes/:id} : get the "id" quiz.
     *
     * @param id the id of the quiz to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the quiz, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable("id") Long id) {
        log.debug("REST request to get Quiz : {}", id);
        Optional<Quiz> quiz = quizService.findOne(id);
        return ResponseUtil.wrapOrNotFound(quiz);
    }

    /**
     * {@code DELETE  /quizzes/:id} : delete the "id" quiz.
     *
     * @param id the id of the quiz to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable("id") Long id) {
        log.debug("REST request to delete Quiz : {}", id);
        quizService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
