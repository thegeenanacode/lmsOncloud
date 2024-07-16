package com.lmsoncloud.web.rest;

import static com.lmsoncloud.domain.GradebookAsserts.*;
import static com.lmsoncloud.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsoncloud.IntegrationTest;
import com.lmsoncloud.domain.Gradebook;
import com.lmsoncloud.domain.enumeration.GradeType;
import com.lmsoncloud.repository.GradebookRepository;
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
 * Integration tests for the {@link GradebookResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GradebookResourceIT {

    private static final GradeType DEFAULT_GRADE_TYPE = GradeType.LETTER;
    private static final GradeType UPDATED_GRADE_TYPE = GradeType.PERCENTAGE;

    private static final String DEFAULT_GRADE_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_GRADE_VALUE = "BBBBBBBBBB";

    private static final String DEFAULT_COMMENTS = "AAAAAAAAAA";
    private static final String UPDATED_COMMENTS = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/gradebooks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private GradebookRepository gradebookRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGradebookMockMvc;

    private Gradebook gradebook;

    private Gradebook insertedGradebook;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gradebook createEntity(EntityManager em) {
        Gradebook gradebook = new Gradebook()
            .gradeType(DEFAULT_GRADE_TYPE)
            .gradeValue(DEFAULT_GRADE_VALUE)
            .comments(DEFAULT_COMMENTS)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
        return gradebook;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gradebook createUpdatedEntity(EntityManager em) {
        Gradebook gradebook = new Gradebook()
            .gradeType(UPDATED_GRADE_TYPE)
            .gradeValue(UPDATED_GRADE_VALUE)
            .comments(UPDATED_COMMENTS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        return gradebook;
    }

    @BeforeEach
    public void initTest() {
        gradebook = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedGradebook != null) {
            gradebookRepository.delete(insertedGradebook);
            insertedGradebook = null;
        }
    }

    @Test
    @Transactional
    void createGradebook() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Gradebook
        var returnedGradebook = om.readValue(
            restGradebookMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(gradebook)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Gradebook.class
        );

        // Validate the Gradebook in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertGradebookUpdatableFieldsEquals(returnedGradebook, getPersistedGradebook(returnedGradebook));

        insertedGradebook = returnedGradebook;
    }

    @Test
    @Transactional
    void createGradebookWithExistingId() throws Exception {
        // Create the Gradebook with an existing ID
        gradebook.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGradebookMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(gradebook)))
            .andExpect(status().isBadRequest());

        // Validate the Gradebook in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGradebooks() throws Exception {
        // Initialize the database
        insertedGradebook = gradebookRepository.saveAndFlush(gradebook);

        // Get all the gradebookList
        restGradebookMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gradebook.getId().intValue())))
            .andExpect(jsonPath("$.[*].gradeType").value(hasItem(DEFAULT_GRADE_TYPE.toString())))
            .andExpect(jsonPath("$.[*].gradeValue").value(hasItem(DEFAULT_GRADE_VALUE)))
            .andExpect(jsonPath("$.[*].comments").value(hasItem(DEFAULT_COMMENTS.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getGradebook() throws Exception {
        // Initialize the database
        insertedGradebook = gradebookRepository.saveAndFlush(gradebook);

        // Get the gradebook
        restGradebookMockMvc
            .perform(get(ENTITY_API_URL_ID, gradebook.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gradebook.getId().intValue()))
            .andExpect(jsonPath("$.gradeType").value(DEFAULT_GRADE_TYPE.toString()))
            .andExpect(jsonPath("$.gradeValue").value(DEFAULT_GRADE_VALUE))
            .andExpect(jsonPath("$.comments").value(DEFAULT_COMMENTS.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingGradebook() throws Exception {
        // Get the gradebook
        restGradebookMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGradebook() throws Exception {
        // Initialize the database
        insertedGradebook = gradebookRepository.saveAndFlush(gradebook);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gradebook
        Gradebook updatedGradebook = gradebookRepository.findById(gradebook.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGradebook are not directly saved in db
        em.detach(updatedGradebook);
        updatedGradebook
            .gradeType(UPDATED_GRADE_TYPE)
            .gradeValue(UPDATED_GRADE_VALUE)
            .comments(UPDATED_COMMENTS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restGradebookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGradebook.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedGradebook))
            )
            .andExpect(status().isOk());

        // Validate the Gradebook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedGradebookToMatchAllProperties(updatedGradebook);
    }

    @Test
    @Transactional
    void putNonExistingGradebook() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gradebook.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGradebookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gradebook.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(gradebook))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gradebook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGradebook() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gradebook.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGradebookMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(gradebook))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gradebook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGradebook() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gradebook.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGradebookMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(gradebook)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Gradebook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGradebookWithPatch() throws Exception {
        // Initialize the database
        insertedGradebook = gradebookRepository.saveAndFlush(gradebook);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gradebook using partial update
        Gradebook partialUpdatedGradebook = new Gradebook();
        partialUpdatedGradebook.setId(gradebook.getId());

        partialUpdatedGradebook
            .gradeType(UPDATED_GRADE_TYPE)
            .gradeValue(UPDATED_GRADE_VALUE)
            .comments(UPDATED_COMMENTS)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restGradebookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGradebook.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGradebook))
            )
            .andExpect(status().isOk());

        // Validate the Gradebook in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGradebookUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedGradebook, gradebook),
            getPersistedGradebook(gradebook)
        );
    }

    @Test
    @Transactional
    void fullUpdateGradebookWithPatch() throws Exception {
        // Initialize the database
        insertedGradebook = gradebookRepository.saveAndFlush(gradebook);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the gradebook using partial update
        Gradebook partialUpdatedGradebook = new Gradebook();
        partialUpdatedGradebook.setId(gradebook.getId());

        partialUpdatedGradebook
            .gradeType(UPDATED_GRADE_TYPE)
            .gradeValue(UPDATED_GRADE_VALUE)
            .comments(UPDATED_COMMENTS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restGradebookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGradebook.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedGradebook))
            )
            .andExpect(status().isOk());

        // Validate the Gradebook in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertGradebookUpdatableFieldsEquals(partialUpdatedGradebook, getPersistedGradebook(partialUpdatedGradebook));
    }

    @Test
    @Transactional
    void patchNonExistingGradebook() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gradebook.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGradebookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, gradebook.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(gradebook))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gradebook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGradebook() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gradebook.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGradebookMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(gradebook))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gradebook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGradebook() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        gradebook.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGradebookMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(gradebook)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Gradebook in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGradebook() throws Exception {
        // Initialize the database
        insertedGradebook = gradebookRepository.saveAndFlush(gradebook);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the gradebook
        restGradebookMockMvc
            .perform(delete(ENTITY_API_URL_ID, gradebook.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return gradebookRepository.count();
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

    protected Gradebook getPersistedGradebook(Gradebook gradebook) {
        return gradebookRepository.findById(gradebook.getId()).orElseThrow();
    }

    protected void assertPersistedGradebookToMatchAllProperties(Gradebook expectedGradebook) {
        assertGradebookAllPropertiesEquals(expectedGradebook, getPersistedGradebook(expectedGradebook));
    }

    protected void assertPersistedGradebookToMatchUpdatableProperties(Gradebook expectedGradebook) {
        assertGradebookAllUpdatablePropertiesEquals(expectedGradebook, getPersistedGradebook(expectedGradebook));
    }
}
