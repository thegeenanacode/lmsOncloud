package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.Project;
import com.lmsoncloud.repository.ProjectRepository;
import com.lmsoncloud.service.ProjectService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.Project}.
 */
@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private static final Logger log = LoggerFactory.getLogger(ProjectServiceImpl.class);

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public Project save(Project project) {
        log.debug("Request to save Project : {}", project);
        return projectRepository.save(project);
    }

    @Override
    public Project update(Project project) {
        log.debug("Request to update Project : {}", project);
        return projectRepository.save(project);
    }

    @Override
    public Optional<Project> partialUpdate(Project project) {
        log.debug("Request to partially update Project : {}", project);

        return projectRepository
            .findById(project.getId())
            .map(existingProject -> {
                if (project.getProjectName() != null) {
                    existingProject.setProjectName(project.getProjectName());
                }
                if (project.getProjectDescription() != null) {
                    existingProject.setProjectDescription(project.getProjectDescription());
                }
                if (project.getSubmissionDate() != null) {
                    existingProject.setSubmissionDate(project.getSubmissionDate());
                }
                if (project.getCreatedBy() != null) {
                    existingProject.setCreatedBy(project.getCreatedBy());
                }
                if (project.getCreatedDate() != null) {
                    existingProject.setCreatedDate(project.getCreatedDate());
                }
                if (project.getLastModifiedBy() != null) {
                    existingProject.setLastModifiedBy(project.getLastModifiedBy());
                }
                if (project.getLastModifiedDate() != null) {
                    existingProject.setLastModifiedDate(project.getLastModifiedDate());
                }

                return existingProject;
            })
            .map(projectRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Project> findAll() {
        log.debug("Request to get all Projects");
        return projectRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Project> findOne(Long id) {
        log.debug("Request to get Project : {}", id);
        return projectRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Project : {}", id);
        projectRepository.deleteById(id);
    }
}
