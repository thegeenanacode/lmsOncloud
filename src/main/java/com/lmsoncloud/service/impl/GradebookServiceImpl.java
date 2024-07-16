package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.Gradebook;
import com.lmsoncloud.repository.GradebookRepository;
import com.lmsoncloud.service.GradebookService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.Gradebook}.
 */
@Service
@Transactional
public class GradebookServiceImpl implements GradebookService {

    private static final Logger log = LoggerFactory.getLogger(GradebookServiceImpl.class);

    private final GradebookRepository gradebookRepository;

    public GradebookServiceImpl(GradebookRepository gradebookRepository) {
        this.gradebookRepository = gradebookRepository;
    }

    @Override
    public Gradebook save(Gradebook gradebook) {
        log.debug("Request to save Gradebook : {}", gradebook);
        return gradebookRepository.save(gradebook);
    }

    @Override
    public Gradebook update(Gradebook gradebook) {
        log.debug("Request to update Gradebook : {}", gradebook);
        return gradebookRepository.save(gradebook);
    }

    @Override
    public Optional<Gradebook> partialUpdate(Gradebook gradebook) {
        log.debug("Request to partially update Gradebook : {}", gradebook);

        return gradebookRepository
            .findById(gradebook.getId())
            .map(existingGradebook -> {
                if (gradebook.getGradeType() != null) {
                    existingGradebook.setGradeType(gradebook.getGradeType());
                }
                if (gradebook.getGradeValue() != null) {
                    existingGradebook.setGradeValue(gradebook.getGradeValue());
                }
                if (gradebook.getComments() != null) {
                    existingGradebook.setComments(gradebook.getComments());
                }
                if (gradebook.getCreatedBy() != null) {
                    existingGradebook.setCreatedBy(gradebook.getCreatedBy());
                }
                if (gradebook.getCreatedDate() != null) {
                    existingGradebook.setCreatedDate(gradebook.getCreatedDate());
                }
                if (gradebook.getLastModifiedBy() != null) {
                    existingGradebook.setLastModifiedBy(gradebook.getLastModifiedBy());
                }
                if (gradebook.getLastModifiedDate() != null) {
                    existingGradebook.setLastModifiedDate(gradebook.getLastModifiedDate());
                }

                return existingGradebook;
            })
            .map(gradebookRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Gradebook> findAll() {
        log.debug("Request to get all Gradebooks");
        return gradebookRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Gradebook> findOne(Long id) {
        log.debug("Request to get Gradebook : {}", id);
        return gradebookRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Gradebook : {}", id);
        gradebookRepository.deleteById(id);
    }
}
