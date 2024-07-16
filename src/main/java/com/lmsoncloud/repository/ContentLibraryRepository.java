package com.lmsoncloud.repository;

import com.lmsoncloud.domain.ContentLibrary;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ContentLibrary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContentLibraryRepository extends JpaRepository<ContentLibrary, Long> {}
