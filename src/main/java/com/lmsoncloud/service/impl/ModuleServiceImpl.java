package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.Module;
import com.lmsoncloud.repository.ModuleRepository;
import com.lmsoncloud.service.ModuleService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.Module}.
 */
@Service
@Transactional
public class ModuleServiceImpl implements ModuleService {

    private static final Logger log = LoggerFactory.getLogger(ModuleServiceImpl.class);

    private final ModuleRepository moduleRepository;

    public ModuleServiceImpl(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    @Override
    public Module save(Module module) {
        log.debug("Request to save Module : {}", module);
        return moduleRepository.save(module);
    }

    @Override
    public Module update(Module module) {
        log.debug("Request to update Module : {}", module);
        return moduleRepository.save(module);
    }

    @Override
    public Optional<Module> partialUpdate(Module module) {
        log.debug("Request to partially update Module : {}", module);

        return moduleRepository
            .findById(module.getId())
            .map(existingModule -> {
                if (module.getTitle() != null) {
                    existingModule.setTitle(module.getTitle());
                }
                if (module.getDescription() != null) {
                    existingModule.setDescription(module.getDescription());
                }
                if (module.getCreatedBy() != null) {
                    existingModule.setCreatedBy(module.getCreatedBy());
                }
                if (module.getCreatedDate() != null) {
                    existingModule.setCreatedDate(module.getCreatedDate());
                }
                if (module.getLastModifiedBy() != null) {
                    existingModule.setLastModifiedBy(module.getLastModifiedBy());
                }
                if (module.getLastModifiedDate() != null) {
                    existingModule.setLastModifiedDate(module.getLastModifiedDate());
                }

                return existingModule;
            })
            .map(moduleRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Module> findAll(Pageable pageable) {
        log.debug("Request to get all Modules");
        return moduleRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Module> findOne(Long id) {
        log.debug("Request to get Module : {}", id);
        return moduleRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Module : {}", id);
        moduleRepository.deleteById(id);
    }
}
