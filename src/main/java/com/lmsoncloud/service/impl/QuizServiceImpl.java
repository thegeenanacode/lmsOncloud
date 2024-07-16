package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.Quiz;
import com.lmsoncloud.repository.QuizRepository;
import com.lmsoncloud.service.QuizService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.Quiz}.
 */
@Service
@Transactional
public class QuizServiceImpl implements QuizService {

    private static final Logger log = LoggerFactory.getLogger(QuizServiceImpl.class);

    private final QuizRepository quizRepository;

    public QuizServiceImpl(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    @Override
    public Quiz save(Quiz quiz) {
        log.debug("Request to save Quiz : {}", quiz);
        return quizRepository.save(quiz);
    }

    @Override
    public Quiz update(Quiz quiz) {
        log.debug("Request to update Quiz : {}", quiz);
        return quizRepository.save(quiz);
    }

    @Override
    public Optional<Quiz> partialUpdate(Quiz quiz) {
        log.debug("Request to partially update Quiz : {}", quiz);

        return quizRepository
            .findById(quiz.getId())
            .map(existingQuiz -> {
                if (quiz.getTitle() != null) {
                    existingQuiz.setTitle(quiz.getTitle());
                }
                if (quiz.getDescription() != null) {
                    existingQuiz.setDescription(quiz.getDescription());
                }
                if (quiz.getCreatedBy() != null) {
                    existingQuiz.setCreatedBy(quiz.getCreatedBy());
                }
                if (quiz.getCreatedDate() != null) {
                    existingQuiz.setCreatedDate(quiz.getCreatedDate());
                }
                if (quiz.getLastModifiedBy() != null) {
                    existingQuiz.setLastModifiedBy(quiz.getLastModifiedBy());
                }
                if (quiz.getLastModifiedDate() != null) {
                    existingQuiz.setLastModifiedDate(quiz.getLastModifiedDate());
                }

                return existingQuiz;
            })
            .map(quizRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Quiz> findAll() {
        log.debug("Request to get all Quizzes");
        return quizRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Quiz> findOne(Long id) {
        log.debug("Request to get Quiz : {}", id);
        return quizRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Quiz : {}", id);
        quizRepository.deleteById(id);
    }
}
