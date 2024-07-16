package com.lmsoncloud.web.rest;

import static com.lmsoncloud.domain.DiscussionAsserts.*;
import static com.lmsoncloud.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsoncloud.IntegrationTest;
import com.lmsoncloud.domain.Discussion;
import com.lmsoncloud.repository.DiscussionRepository;
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
 * Integration tests for the {@link DiscussionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DiscussionResourceIT {

    private static final String DEFAULT_TOPIC = "AAAAAAAAAA";
    private static final String UPDATED_TOPIC = "BBBBBBBBBB";

    private static final String DEFAULT_DETAILS = "AAAAAAAAAA";
    private static final String UPDATED_DETAILS = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LAST_MODIFIED_BY = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MODIFIED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_LAST_MODIFIED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_MODIFIED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/discussions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DiscussionRepository discussionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDiscussionMockMvc;

    private Discussion discussion;

    private Discussion insertedDiscussion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Discussion createEntity(EntityManager em) {
        Discussion discussion = new Discussion()
            .topic(DEFAULT_TOPIC)
            .details(DEFAULT_DETAILS)
            .createdBy(DEFAULT_CREATED_BY)
            .createdDate(DEFAULT_CREATED_DATE)
            .lastModifiedBy(DEFAULT_LAST_MODIFIED_BY)
            .lastModifiedDate(DEFAULT_LAST_MODIFIED_DATE);
        return discussion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Discussion createUpdatedEntity(EntityManager em) {
        Discussion discussion = new Discussion()
            .topic(UPDATED_TOPIC)
            .details(UPDATED_DETAILS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);
        return discussion;
    }

    @BeforeEach
    public void initTest() {
        discussion = createEntity(em);
    }

    @AfterEach
    public void cleanup() {
        if (insertedDiscussion != null) {
            discussionRepository.delete(insertedDiscussion);
            insertedDiscussion = null;
        }
    }

    @Test
    @Transactional
    void createDiscussion() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Discussion
        var returnedDiscussion = om.readValue(
            restDiscussionMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(discussion)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Discussion.class
        );

        // Validate the Discussion in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertDiscussionUpdatableFieldsEquals(returnedDiscussion, getPersistedDiscussion(returnedDiscussion));

        insertedDiscussion = returnedDiscussion;
    }

    @Test
    @Transactional
    void createDiscussionWithExistingId() throws Exception {
        // Create the Discussion with an existing ID
        discussion.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDiscussionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(discussion)))
            .andExpect(status().isBadRequest());

        // Validate the Discussion in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTopicIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        discussion.setTopic(null);

        // Create the Discussion, which fails.

        restDiscussionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(discussion)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDiscussions() throws Exception {
        // Initialize the database
        insertedDiscussion = discussionRepository.saveAndFlush(discussion);

        // Get all the discussionList
        restDiscussionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(discussion.getId().intValue())))
            .andExpect(jsonPath("$.[*].topic").value(hasItem(DEFAULT_TOPIC)))
            .andExpect(jsonPath("$.[*].details").value(hasItem(DEFAULT_DETAILS.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].lastModifiedBy").value(hasItem(DEFAULT_LAST_MODIFIED_BY)))
            .andExpect(jsonPath("$.[*].lastModifiedDate").value(hasItem(DEFAULT_LAST_MODIFIED_DATE.toString())));
    }

    @Test
    @Transactional
    void getDiscussion() throws Exception {
        // Initialize the database
        insertedDiscussion = discussionRepository.saveAndFlush(discussion);

        // Get the discussion
        restDiscussionMockMvc
            .perform(get(ENTITY_API_URL_ID, discussion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(discussion.getId().intValue()))
            .andExpect(jsonPath("$.topic").value(DEFAULT_TOPIC))
            .andExpect(jsonPath("$.details").value(DEFAULT_DETAILS.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.lastModifiedBy").value(DEFAULT_LAST_MODIFIED_BY))
            .andExpect(jsonPath("$.lastModifiedDate").value(DEFAULT_LAST_MODIFIED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDiscussion() throws Exception {
        // Get the discussion
        restDiscussionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDiscussion() throws Exception {
        // Initialize the database
        insertedDiscussion = discussionRepository.saveAndFlush(discussion);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the discussion
        Discussion updatedDiscussion = discussionRepository.findById(discussion.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDiscussion are not directly saved in db
        em.detach(updatedDiscussion);
        updatedDiscussion
            .topic(UPDATED_TOPIC)
            .details(UPDATED_DETAILS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restDiscussionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDiscussion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedDiscussion))
            )
            .andExpect(status().isOk());

        // Validate the Discussion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDiscussionToMatchAllProperties(updatedDiscussion);
    }

    @Test
    @Transactional
    void putNonExistingDiscussion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discussion.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiscussionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, discussion.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(discussion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Discussion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDiscussion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discussion.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscussionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(discussion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Discussion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDiscussion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discussion.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscussionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(discussion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Discussion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDiscussionWithPatch() throws Exception {
        // Initialize the database
        insertedDiscussion = discussionRepository.saveAndFlush(discussion);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the discussion using partial update
        Discussion partialUpdatedDiscussion = new Discussion();
        partialUpdatedDiscussion.setId(discussion.getId());

        partialUpdatedDiscussion.createdBy(UPDATED_CREATED_BY).lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restDiscussionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiscussion.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDiscussion))
            )
            .andExpect(status().isOk());

        // Validate the Discussion in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDiscussionUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedDiscussion, discussion),
            getPersistedDiscussion(discussion)
        );
    }

    @Test
    @Transactional
    void fullUpdateDiscussionWithPatch() throws Exception {
        // Initialize the database
        insertedDiscussion = discussionRepository.saveAndFlush(discussion);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the discussion using partial update
        Discussion partialUpdatedDiscussion = new Discussion();
        partialUpdatedDiscussion.setId(discussion.getId());

        partialUpdatedDiscussion
            .topic(UPDATED_TOPIC)
            .details(UPDATED_DETAILS)
            .createdBy(UPDATED_CREATED_BY)
            .createdDate(UPDATED_CREATED_DATE)
            .lastModifiedBy(UPDATED_LAST_MODIFIED_BY)
            .lastModifiedDate(UPDATED_LAST_MODIFIED_DATE);

        restDiscussionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiscussion.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDiscussion))
            )
            .andExpect(status().isOk());

        // Validate the Discussion in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDiscussionUpdatableFieldsEquals(partialUpdatedDiscussion, getPersistedDiscussion(partialUpdatedDiscussion));
    }

    @Test
    @Transactional
    void patchNonExistingDiscussion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discussion.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiscussionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, discussion.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(discussion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Discussion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDiscussion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discussion.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscussionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(discussion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Discussion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDiscussion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        discussion.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiscussionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(discussion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Discussion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDiscussion() throws Exception {
        // Initialize the database
        insertedDiscussion = discussionRepository.saveAndFlush(discussion);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the discussion
        restDiscussionMockMvc
            .perform(delete(ENTITY_API_URL_ID, discussion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return discussionRepository.count();
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

    protected Discussion getPersistedDiscussion(Discussion discussion) {
        return discussionRepository.findById(discussion.getId()).orElseThrow();
    }

    protected void assertPersistedDiscussionToMatchAllProperties(Discussion expectedDiscussion) {
        assertDiscussionAllPropertiesEquals(expectedDiscussion, getPersistedDiscussion(expectedDiscussion));
    }

    protected void assertPersistedDiscussionToMatchUpdatableProperties(Discussion expectedDiscussion) {
        assertDiscussionAllUpdatablePropertiesEquals(expectedDiscussion, getPersistedDiscussion(expectedDiscussion));
    }
}
