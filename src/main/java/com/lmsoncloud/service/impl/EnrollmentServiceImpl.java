package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.Enrollment;
import com.lmsoncloud.repository.EnrollmentRepository;
import com.lmsoncloud.service.EnrollmentService;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.Enrollment}.
 */
@Service
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    private static final Logger log = LoggerFactory.getLogger(EnrollmentServiceImpl.class);

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentServiceImpl(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    @Override
    public Enrollment save(Enrollment enrollment) {
        log.debug("Request to save Enrollment : {}", enrollment);
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public Enrollment update(Enrollment enrollment) {
        log.debug("Request to update Enrollment : {}", enrollment);
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public Optional<Enrollment> partialUpdate(Enrollment enrollment) {
        log.debug("Request to partially update Enrollment : {}", enrollment);

        return enrollmentRepository
            .findById(enrollment.getId())
            .map(existingEnrollment -> {
                if (enrollment.getEnrollmentDate() != null) {
                    existingEnrollment.setEnrollmentDate(enrollment.getEnrollmentDate());
                }
                if (enrollment.getStatus() != null) {
                    existingEnrollment.setStatus(enrollment.getStatus());
                }
                if (enrollment.getCreatedBy() != null) {
                    existingEnrollment.setCreatedBy(enrollment.getCreatedBy());
                }
                if (enrollment.getCreatedDate() != null) {
                    existingEnrollment.setCreatedDate(enrollment.getCreatedDate());
                }
                if (enrollment.getLastModifiedBy() != null) {
                    existingEnrollment.setLastModifiedBy(enrollment.getLastModifiedBy());
                }
                if (enrollment.getLastModifiedDate() != null) {
                    existingEnrollment.setLastModifiedDate(enrollment.getLastModifiedDate());
                }

                return existingEnrollment;
            })
            .map(enrollmentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Enrollment> findAll() {
        log.debug("Request to get all Enrollments");
        return enrollmentRepository.findAll();
    }

    /**
     *  Get all the enrollments where AppUser is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Enrollment> findAllWhereAppUserIsNull() {
        log.debug("Request to get all enrollments where AppUser is null");
        return StreamSupport.stream(enrollmentRepository.findAll().spliterator(), false)
            .filter(enrollment -> enrollment.getAppUser() == null)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Enrollment> findOne(Long id) {
        log.debug("Request to get Enrollment : {}", id);
        return enrollmentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Enrollment : {}", id);
        enrollmentRepository.deleteById(id);
    }
}
