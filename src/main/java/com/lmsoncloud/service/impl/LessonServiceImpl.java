package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.Lesson;
import com.lmsoncloud.repository.LessonRepository;
import com.lmsoncloud.service.LessonService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.Lesson}.
 */
@Service
@Transactional
public class LessonServiceImpl implements LessonService {

    private static final Logger log = LoggerFactory.getLogger(LessonServiceImpl.class);

    private final LessonRepository lessonRepository;

    public LessonServiceImpl(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    @Override
    public Lesson save(Lesson lesson) {
        log.debug("Request to save Lesson : {}", lesson);
        return lessonRepository.save(lesson);
    }

    @Override
    public Lesson update(Lesson lesson) {
        log.debug("Request to update Lesson : {}", lesson);
        return lessonRepository.save(lesson);
    }

    @Override
    public Optional<Lesson> partialUpdate(Lesson lesson) {
        log.debug("Request to partially update Lesson : {}", lesson);

        return lessonRepository
            .findById(lesson.getId())
            .map(existingLesson -> {
                if (lesson.getTitle() != null) {
                    existingLesson.setTitle(lesson.getTitle());
                }
                if (lesson.getContent() != null) {
                    existingLesson.setContent(lesson.getContent());
                }
                if (lesson.getVideoUrl() != null) {
                    existingLesson.setVideoUrl(lesson.getVideoUrl());
                }
                if (lesson.getCreatedBy() != null) {
                    existingLesson.setCreatedBy(lesson.getCreatedBy());
                }
                if (lesson.getCreatedDate() != null) {
                    existingLesson.setCreatedDate(lesson.getCreatedDate());
                }
                if (lesson.getLastModifiedBy() != null) {
                    existingLesson.setLastModifiedBy(lesson.getLastModifiedBy());
                }
                if (lesson.getLastModifiedDate() != null) {
                    existingLesson.setLastModifiedDate(lesson.getLastModifiedDate());
                }

                return existingLesson;
            })
            .map(lessonRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Lesson> findAll(Pageable pageable) {
        log.debug("Request to get all Lessons");
        return lessonRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Lesson> findOne(Long id) {
        log.debug("Request to get Lesson : {}", id);
        return lessonRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Lesson : {}", id);
        lessonRepository.deleteById(id);
    }
}
