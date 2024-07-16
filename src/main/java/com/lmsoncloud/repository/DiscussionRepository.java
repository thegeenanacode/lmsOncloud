package com.lmsoncloud.repository;

import com.lmsoncloud.domain.Discussion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Discussion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {}
