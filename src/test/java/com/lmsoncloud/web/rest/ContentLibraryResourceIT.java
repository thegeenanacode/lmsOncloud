package com.lmsoncloud.web.rest;

import static com.lmsoncloud.domain.ContentLibraryAsserts.*;
import static com.lmsoncloud.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsoncloud.IntegrationTest;
import com.lmsoncloud.domain.ContentLibrary;
import com.lmsoncloud.domain.enumeration.ResourceType;
import com.lmsoncloud.repository.ContentLibraryRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ContentLibraryResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ContentLibraryResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ResourceType DEFAULT_RESOURCE_TYPE = ResourceType.VIDEO;
    private static final ResourceType UPDATED_RESOURCE_TYPE = ResourceType.DOCUMENT;

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/content-libraries";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ContentLibraryRepository contentLibraryRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restContentLibraryMockMvc;

    private ContentLibrary contentLibrary;

    private ContentLibrary insertedContentLibrary;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ContentLibrary createEntity(EntityManager em) {
        ContentLibrary contentLibrary = new ContentLibrary()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .resourceType(DEFAULT_RESOURCE_TYPE)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
        return contentLibrary;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ContentLibrary createUpdatedEntity(EntityManager em) {
        ContentLibrary contentLibrary = new ContentLibrary()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .resourceType(UPDATED_RESOURCE_TYPE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        return contentLibrary;
    }

    @BeforeEach
    public void initTest() {
        contentLibrary = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedContentLibrary != null) {
            contentLibraryRepository.delete(insertedContentLibrary);
            insertedContentLibrary = null;
        }
    }

    @Test
    @Transactional
    void createContentLibrary() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ContentLibrary
        var returnedContentLibrary = om.readValue(
            restContentLibraryMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contentLibrary)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ContentLibrary.class
        );

        // Validate the ContentLibrary in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertContentLibraryUpdatableFieldsEquals(returnedContentLibrary, getPersistedContentLibrary(returnedContentLibrary));

        insertedContentLibrary = returnedContentLibrary;
    }

    @Test
    @Transactional
    void createContentLibraryWithExistingId() throws Exception {
        // Create the ContentLibrary with an existing ID
        contentLibrary.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restContentLibraryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contentLibrary)))
            .andExpect(status().isBadRequest());

        // Validate the ContentLibrary in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        contentLibrary.setName(null);

        // Create the ContentLibrary, which fails.

        restContentLibraryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contentLibrary)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllContentLibraries() throws Exception {
        // Initialize the database
        insertedContentLibrary = contentLibraryRepository.saveAndFlush(contentLibrary);

        // Get all the contentLibraryList
        restContentLibraryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(contentLibrary.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].resourceType").value(hasItem(DEFAULT_RESOURCE_TYPE.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getContentLibrary() throws Exception {
        // Initialize the database
        insertedContentLibrary = contentLibraryRepository.saveAndFlush(contentLibrary);

        // Get the contentLibrary
        restContentLibraryMockMvc
            .perform(get(ENTITY_API_URL_ID, contentLibrary.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(contentLibrary.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.resourceType").value(DEFAULT_RESOURCE_TYPE.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingContentLibrary() throws Exception {
        // Get the contentLibrary
        restContentLibraryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingContentLibrary() throws Exception {
        // Initialize the database
        insertedContentLibrary = contentLibraryRepository.saveAndFlush(contentLibrary);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the contentLibrary
        ContentLibrary updatedContentLibrary = contentLibraryRepository.findById(contentLibrary.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedContentLibrary are not directly saved in db
        em.detach(updatedContentLibrary);
        updatedContentLibrary
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .resourceType(UPDATED_RESOURCE_TYPE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restContentLibraryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedContentLibrary.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedContentLibrary))
            )
            .andExpect(status().isOk());

        // Validate the ContentLibrary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedContentLibraryToMatchAllProperties(updatedContentLibrary);
    }

    @Test
    @Transactional
    void putNonExistingContentLibrary() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contentLibrary.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContentLibraryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, contentLibrary.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(contentLibrary))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContentLibrary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchContentLibrary() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contentLibrary.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContentLibraryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(contentLibrary))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContentLibrary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamContentLibrary() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contentLibrary.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContentLibraryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(contentLibrary)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ContentLibrary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateContentLibraryWithPatch() throws Exception {
        // Initialize the database
        insertedContentLibrary = contentLibraryRepository.saveAndFlush(contentLibrary);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the contentLibrary using partial update
        ContentLibrary partialUpdatedContentLibrary = new ContentLibrary();
        partialUpdatedContentLibrary.setId(contentLibrary.getId());

        partialUpdatedContentLibrary.lastModifiedBy(UPDATED_LAST_MODIFIED_BY).lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restContentLibraryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContentLibrary.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedContentLibrary))
            )
            .andExpect(status().isOk());

        // Validate the ContentLibrary in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertContentLibraryUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedContentLibrary, contentLibrary),
            getPersistedContentLibrary(contentLibrary)
        );
    }

    @Test
    @Transactional
    void fullUpdateContentLibraryWithPatch() throws Exception {
        // Initialize the database
        insertedContentLibrary = contentLibraryRepository.saveAndFlush(contentLibrary);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the contentLibrary using partial update
        ContentLibrary partialUpdatedContentLibrary = new ContentLibrary();
        partialUpdatedContentLibrary.setId(contentLibrary.getId());

        partialUpdatedContentLibrary
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .resourceType(UPDATED_RESOURCE_TYPE)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restContentLibraryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedContentLibrary.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedContentLibrary))
            )
            .andExpect(status().isOk());

        // Validate the ContentLibrary in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertContentLibraryUpdatableFieldsEquals(partialUpdatedContentLibrary, getPersistedContentLibrary(partialUpdatedContentLibrary));
    }

    @Test
    @Transactional
    void patchNonExistingContentLibrary() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contentLibrary.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContentLibraryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, contentLibrary.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(contentLibrary))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContentLibrary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchContentLibrary() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contentLibrary.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContentLibraryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(contentLibrary))
            )
            .andExpect(status().isBadRequest());

        // Validate the ContentLibrary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamContentLibrary() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        contentLibrary.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restContentLibraryMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(contentLibrary)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ContentLibrary in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteContentLibrary() throws Exception {
        // Initialize the database
        insertedContentLibrary = contentLibraryRepository.saveAndFlush(contentLibrary);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the contentLibrary
        restContentLibraryMockMvc
            .perform(delete(ENTITY_API_URL_ID, contentLibrary.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return contentLibraryRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected ContentLibrary getPersistedContentLibrary(ContentLibrary contentLibrary) {
        return contentLibraryRepository.findById(contentLibrary.getId()).orElseThrow();
    }

    protected void assertPersistedContentLibraryToMatchAllProperties(ContentLibrary expectedContentLibrary) {
        assertContentLibraryAllPropertiesEquals(expectedContentLibrary, getPersistedContentLibrary(expectedContentLibrary));
    }

    protected void assertPersistedContentLibraryToMatchUpdatableProperties(ContentLibrary expectedContentLibrary) {
        assertContentLibraryAllUpdatablePropertiesEquals(expectedContentLibrary, getPersistedContentLibrary(expectedContentLibrary));
    }
}
