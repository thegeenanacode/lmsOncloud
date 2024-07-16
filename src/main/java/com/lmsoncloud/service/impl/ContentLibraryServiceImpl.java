package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.ContentLibrary;
import com.lmsoncloud.repository.ContentLibraryRepository;
import com.lmsoncloud.service.ContentLibraryService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.ContentLibrary}.
 */
@Service
@Transactional
public class ContentLibraryServiceImpl implements ContentLibraryService {

    private static final Logger log = LoggerFactory.getLogger(ContentLibraryServiceImpl.class);

    private final ContentLibraryRepository contentLibraryRepository;

    public ContentLibraryServiceImpl(ContentLibraryRepository contentLibraryRepository) {
        this.contentLibraryRepository = contentLibraryRepository;
    }

    @Override
    public ContentLibrary save(ContentLibrary contentLibrary) {
        log.debug("Request to save ContentLibrary : {}", contentLibrary);
        return contentLibraryRepository.save(contentLibrary);
    }

    @Override
    public ContentLibrary update(ContentLibrary contentLibrary) {
        log.debug("Request to update ContentLibrary : {}", contentLibrary);
        return contentLibraryRepository.save(contentLibrary);
    }

    @Override
    public Optional<ContentLibrary> partialUpdate(ContentLibrary contentLibrary) {
        log.debug("Request to partially update ContentLibrary : {}", contentLibrary);

        return contentLibraryRepository
            .findById(contentLibrary.getId())
            .map(existingContentLibrary -> {
                if (contentLibrary.getName() != null) {
                    existingContentLibrary.setName(contentLibrary.getName());
                }
                if (contentLibrary.getDescription() != null) {
                    existingContentLibrary.setDescription(contentLibrary.getDescription());
                }
                if (contentLibrary.getResourceType() != null) {
                    existingContentLibrary.setResourceType(contentLibrary.getResourceType());
                }
                if (contentLibrary.getCreatedBy() != null) {
                    existingContentLibrary.setCreatedBy(contentLibrary.getCreatedBy());
                }
                if (contentLibrary.getCreatedDate() != null) {
                    existingContentLibrary.setCreatedDate(contentLibrary.getCreatedDate());
                }
                if (contentLibrary.getLastModifiedBy() != null) {
                    existingContentLibrary.setLastModifiedBy(contentLibrary.getLastModifiedBy());
                }
                if (contentLibrary.getLastModifiedDate() != null) {
                    existingContentLibrary.setLastModifiedDate(contentLibrary.getLastModifiedDate());
                }

                return existingContentLibrary;
            })
            .map(contentLibraryRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentLibrary> findAll() {
        log.debug("Request to get all ContentLibraries");
        return contentLibraryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ContentLibrary> findOne(Long id) {
        log.debug("Request to get ContentLibrary : {}", id);
        return contentLibraryRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ContentLibrary : {}", id);
        contentLibraryRepository.deleteById(id);
    }
}
