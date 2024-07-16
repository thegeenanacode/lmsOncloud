package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.Announcement;
import com.lmsoncloud.repository.AnnouncementRepository;
import com.lmsoncloud.service.AnnouncementService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.Announcement}.
 */
@Service
@Transactional
public class AnnouncementServiceImpl implements AnnouncementService {

    private static final Logger log = LoggerFactory.getLogger(AnnouncementServiceImpl.class);

    private final AnnouncementRepository announcementRepository;

    public AnnouncementServiceImpl(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @Override
    public Announcement save(Announcement announcement) {
        log.debug("Request to save Announcement : {}", announcement);
        return announcementRepository.save(announcement);
    }

    @Override
    public Announcement update(Announcement announcement) {
        log.debug("Request to update Announcement : {}", announcement);
        return announcementRepository.save(announcement);
    }

    @Override
    public Optional<Announcement> partialUpdate(Announcement announcement) {
        log.debug("Request to partially update Announcement : {}", announcement);

        return announcementRepository
            .findById(announcement.getId())
            .map(existingAnnouncement -> {
                if (announcement.getTitle() != null) {
                    existingAnnouncement.setTitle(announcement.getTitle());
                }
                if (announcement.getContent() != null) {
                    existingAnnouncement.setContent(announcement.getContent());
                }
                if (announcement.getPublishDate() != null) {
                    existingAnnouncement.setPublishDate(announcement.getPublishDate());
                }
                if (announcement.getCreatedBy() != null) {
                    existingAnnouncement.setCreatedBy(announcement.getCreatedBy());
                }
                if (announcement.getCreatedDate() != null) {
                    existingAnnouncement.setCreatedDate(announcement.getCreatedDate());
                }
                if (announcement.getLastModifiedBy() != null) {
                    existingAnnouncement.setLastModifiedBy(announcement.getLastModifiedBy());
                }
                if (announcement.getLastModifiedDate() != null) {
                    existingAnnouncement.setLastModifiedDate(announcement.getLastModifiedDate());
                }

                return existingAnnouncement;
            })
            .map(announcementRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Announcement> findAll() {
        log.debug("Request to get all Announcements");
        return announcementRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Announcement> findOne(Long id) {
        log.debug("Request to get Announcement : {}", id);
        return announcementRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Announcement : {}", id);
        announcementRepository.deleteById(id);
    }
}
