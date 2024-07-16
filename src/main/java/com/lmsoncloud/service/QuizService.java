package com.lmsoncloud.service;

import com.lmsoncloud.domain.Quiz;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.lmsoncloud.domain.Quiz}.
 */
public interface QuizService {
    /**
     * Save a quiz.
     *
     * @param quiz the entity to save.
     * @return the persisted entity.
     */
    Quiz save(Quiz quiz);

    /**
     * Updates a quiz.
     *
     * @param quiz the entity to update.
     * @return the persisted entity.
     */
    Quiz update(Quiz quiz);

    /**
     * Partially updates a quiz.
     *
     * @param quiz the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Quiz> partialUpdate(Quiz quiz);

    /**
     * Get all the quizzes.
     *
     * @return the list of entities.
     */
    List<Quiz> findAll();

    /**
     * Get the "id" quiz.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Quiz> findOne(Long id);

    /**
     * Delete the "id" quiz.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
