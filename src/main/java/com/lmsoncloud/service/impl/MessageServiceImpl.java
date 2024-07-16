package com.lmsoncloud.service.impl;

import com.lmsoncloud.domain.Message;
import com.lmsoncloud.repository.MessageRepository;
import com.lmsoncloud.service.MessageService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.lmsoncloud.domain.Message}.
 */
@Service
@Transactional
public class MessageServiceImpl implements MessageService {

    private static final Logger log = LoggerFactory.getLogger(MessageServiceImpl.class);

    private final MessageRepository messageRepository;

    public MessageServiceImpl(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public Message save(Message message) {
        log.debug("Request to save Message : {}", message);
        return messageRepository.save(message);
    }

    @Override
    public Message update(Message message) {
        log.debug("Request to update Message : {}", message);
        return messageRepository.save(message);
    }

    @Override
    public Optional<Message> partialUpdate(Message message) {
        log.debug("Request to partially update Message : {}", message);

        return messageRepository
            .findById(message.getId())
            .map(existingMessage -> {
                if (message.getContent() != null) {
                    existingMessage.setContent(message.getContent());
                }
                if (message.getTimestamp() != null) {
                    existingMessage.setTimestamp(message.getTimestamp());
                }
                if (message.getSender() != null) {
                    existingMessage.setSender(message.getSender());
                }
                if (message.getCreatedBy() != null) {
                    existingMessage.setCreatedBy(message.getCreatedBy());
                }
                if (message.getCreatedDate() != null) {
                    existingMessage.setCreatedDate(message.getCreatedDate());
                }
                if (message.getLastModifiedBy() != null) {
                    existingMessage.setLastModifiedBy(message.getLastModifiedBy());
                }
                if (message.getLastModifiedDate() != null) {
                    existingMessage.setLastModifiedDate(message.getLastModifiedDate());
                }

                return existingMessage;
            })
            .map(messageRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Message> findAll() {
        log.debug("Request to get all Messages");
        return messageRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Message> findOne(Long id) {
        log.debug("Request to get Message : {}", id);
        return messageRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Message : {}", id);
        messageRepository.deleteById(id);
    }
}
