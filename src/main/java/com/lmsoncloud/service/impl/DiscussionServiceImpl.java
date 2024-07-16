package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.Discussion;
import com.lmsoncloud.repository.DiscussionRepository;
import com.lmsoncloud.service.DiscussionService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.Discussion}.
 */
@Service
@Transactional
public class DiscussionServiceImpl implements DiscussionService {

    private static final Logger log = LoggerFactory.getLogger(DiscussionServiceImpl.class);

    private final DiscussionRepository discussionRepository;

    public DiscussionServiceImpl(DiscussionRepository discussionRepository) {
        this.discussionRepository = discussionRepository;
    }

    @Override
    public Discussion save(Discussion discussion) {
        log.debug("Request to save Discussion : {}", discussion);
        return discussionRepository.save(discussion);
    }

    @Override
    public Discussion update(Discussion discussion) {
        log.debug("Request to update Discussion : {}", discussion);
        return discussionRepository.save(discussion);
    }

    @Override
    public Optional<Discussion> partialUpdate(Discussion discussion) {
        log.debug("Request to partially update Discussion : {}", discussion);

        return discussionRepository
            .findById(discussion.getId())
            .map(existingDiscussion -> {
                if (discussion.getTopic() != null) {
                    existingDiscussion.setTopic(discussion.getTopic());
                }
                if (discussion.getDetails() != null) {
                    existingDiscussion.setDetails(discussion.getDetails());
                }
                if (discussion.getCreatedBy() != null) {
                    existingDiscussion.setCreatedBy(discussion.getCreatedBy());
                }
                if (discussion.getCreatedDate() != null) {
                    existingDiscussion.setCreatedDate(discussion.getCreatedDate());
                }
                if (discussion.getLastModifiedBy() != null) {
                    existingDiscussion.setLastModifiedBy(discussion.getLastModifiedBy());
                }
                if (discussion.getLastModifiedDate() != null) {
                    existingDiscussion.setLastModifiedDate(discussion.getLastModifiedDate());
                }

                return existingDiscussion;
            })
            .map(discussionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Discussion> findAll() {
        log.debug("Request to get all Discussions");
        return discussionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Discussion> findOne(Long id) {
        log.debug("Request to get Discussion : {}", id);
        return discussionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Discussion : {}", id);
        discussionRepository.deleteById(id);
    }
}
