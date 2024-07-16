package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.Assignment;
import com.lmsoncloud.repository.AssignmentRepository;
import com.lmsoncloud.service.AssignmentService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.Assignment}.
 */
@Service
@Transactional
public class AssignmentServiceImpl implements AssignmentService {

    private static final Logger log = LoggerFactory.getLogger(AssignmentServiceImpl.class);

    private final AssignmentRepository assignmentRepository;

    public AssignmentServiceImpl(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    @Override
    public Assignment save(Assignment assignment) {
        log.debug("Request to save Assignment : {}", assignment);
        return assignmentRepository.save(assignment);
    }

    @Override
    public Assignment update(Assignment assignment) {
        log.debug("Request to update Assignment : {}", assignment);
        return assignmentRepository.save(assignment);
    }

    @Override
    public Optional<Assignment> partialUpdate(Assignment assignment) {
        log.debug("Request to partially update Assignment : {}", assignment);

        return assignmentRepository
            .findById(assignment.getId())
            .map(existingAssignment -> {
                if (assignment.getName() != null) {
                    existingAssignment.setName(assignment.getName());
                }
                if (assignment.getDescription() != null) {
                    existingAssignment.setDescription(assignment.getDescription());
                }
                if (assignment.getDueDate() != null) {
                    existingAssignment.setDueDate(assignment.getDueDate());
                }
                if (assignment.getCreatedBy() != null) {
                    existingAssignment.setCreatedBy(assignment.getCreatedBy());
                }
                if (assignment.getCreatedDate() != null) {
                    existingAssignment.setCreatedDate(assignment.getCreatedDate());
                }
                if (assignment.getLastModifiedBy() != null) {
                    existingAssignment.setLastModifiedBy(assignment.getLastModifiedBy());
                }
                if (assignment.getLastModifiedDate() != null) {
                    existingAssignment.setLastModifiedDate(assignment.getLastModifiedDate());
                }

                return existingAssignment;
            })
            .map(assignmentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Assignment> findAll() {
        log.debug("Request to get all Assignments");
        return assignmentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Assignment> findOne(Long id) {
        log.debug("Request to get Assignment : {}", id);
        return assignmentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Assignment : {}", id);
        assignmentRepository.deleteById(id);
    }
}
