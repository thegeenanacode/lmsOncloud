package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.Course;
import com.lmsoncloud.repository.CourseRepository;
import com.lmsoncloud.service.CourseService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.Course}.
 */
@Service
@Transactional
public class CourseServiceImpl implements CourseService {

    private static final Logger log = LoggerFactory.getLogger(CourseServiceImpl.class);

    private final CourseRepository courseRepository;

    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public Course save(Course course) {
        log.debug("Request to save Course : {}", course);
        return courseRepository.save(course);
    }

    @Override
    public Course update(Course course) {
        log.debug("Request to update Course : {}", course);
        return courseRepository.save(course);
    }

    @Override
    public Optional<Course> partialUpdate(Course course) {
        log.debug("Request to partially update Course : {}", course);

        return courseRepository
            .findById(course.getId())
            .map(existingCourse -> {
                if (course.getName() != null) {
                    existingCourse.setName(course.getName());
                }
                if (course.getDescription() != null) {
                    existingCourse.setDescription(course.getDescription());
                }
                if (course.getStartDate() != null) {
                    existingCourse.setStartDate(course.getStartDate());
                }
                if (course.getEndDate() != null) {
                    existingCourse.setEndDate(course.getEndDate());
                }
                if (course.getCreatedBy() != null) {
                    existingCourse.setCreatedBy(course.getCreatedBy());
                }
                if (course.getCreatedDate() != null) {
                    existingCourse.setCreatedDate(course.getCreatedDate());
                }
                if (course.getLastModifiedBy() != null) {
                    existingCourse.setLastModifiedBy(course.getLastModifiedBy());
                }
                if (course.getLastModifiedDate() != null) {
                    existingCourse.setLastModifiedDate(course.getLastModifiedDate());
                }

                return existingCourse;
            })
            .map(courseRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Course> findAll(Pageable pageable) {
        log.debug("Request to get all Courses");
        return courseRepository.findAll(pageable);
    }

    public Page<Course> findAllWithEagerRelationships(Pageable pageable) {
        return courseRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Course> findOne(Long id) {
        log.debug("Request to get Course : {}", id);
        return courseRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Course : {}", id);
        courseRepository.deleteById(id);
    }
}
