package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.AppUser;
import com.lmsoncloud.repository.AppUserRepository;
import com.lmsoncloud.service.AppUserService;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.AppUser}.
 */
@Service
@Transactional
public class AppUserServiceImpl implements AppUserService {

    private static final Logger log = LoggerFactory.getLogger(AppUserServiceImpl.class);

    private final AppUserRepository appUserRepository;

    public AppUserServiceImpl(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public AppUser save(AppUser appUser) {
        log.debug("Request to save AppUser : {}", appUser);
        return appUserRepository.save(appUser);
    }

    @Override
    public AppUser update(AppUser appUser) {
        log.debug("Request to update AppUser : {}", appUser);
        return appUserRepository.save(appUser);
    }

    @Override
    public Optional<AppUser> partialUpdate(AppUser appUser) {
        log.debug("Request to partially update AppUser : {}", appUser);

        return appUserRepository
            .findById(appUser.getId())
            .map(existingAppUser -> {
                if (appUser.getUsername() != null) {
                    existingAppUser.setUsername(appUser.getUsername());
                }
                if (appUser.getPassword() != null) {
                    existingAppUser.setPassword(appUser.getPassword());
                }
                if (appUser.getEmail() != null) {
                    existingAppUser.setEmail(appUser.getEmail());
                }
                if (appUser.getRole() != null) {
                    existingAppUser.setRole(appUser.getRole());
                }
                if (appUser.getFirstName() != null) {
                    existingAppUser.setFirstName(appUser.getFirstName());
                }
                if (appUser.getLastName() != null) {
                    existingAppUser.setLastName(appUser.getLastName());
                }
                if (appUser.getCreatedDate() != null) {
                    existingAppUser.setCreatedDate(appUser.getCreatedDate());
                }
                if (appUser.getLastModifiedDate() != null) {
                    existingAppUser.setLastModifiedDate(appUser.getLastModifiedDate());
                }
                if (appUser.getLastLoginDate() != null) {
                    existingAppUser.setLastLoginDate(appUser.getLastLoginDate());
                }
                if (appUser.getIsActive() != null) {
                    existingAppUser.setIsActive(appUser.getIsActive());
                }

                return existingAppUser;
            })
            .map(appUserRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppUser> findAll(Pageable pageable) {
        log.debug("Request to get all AppUsers");
        return appUserRepository.findAll(pageable);
    }

    /**
     *  Get all the appUsers where Gradebook is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<AppUser> findAllWhereGradebookIsNull() {
        log.debug("Request to get all appUsers where Gradebook is null");
        return StreamSupport.stream(appUserRepository.findAll().spliterator(), false)
            .filter(appUser -> appUser.getGradebook() == null)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AppUser> findOne(Long id) {
        log.debug("Request to get AppUser : {}", id);
        return appUserRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete AppUser : {}", id);
        appUserRepository.deleteById(id);
    }
}
