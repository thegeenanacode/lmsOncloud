package com.lmsoncloud.repository;

import com.lmsoncloud.domain.Gradebook;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Gradebook entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GradebookRepository extends JpaRepository<Gradebook, Long> {}
