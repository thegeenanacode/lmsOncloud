package com.lmsoncloud.domain;

import static org.assertj.core.api.Assertions.assertThat;

public class DiscussionAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertDiscussionAllPropertiesEquals(Discussion expected, Discussion actual) {
        assertDiscussionAutoGeneratedPropertiesEquals(expected, actual);
        assertDiscussionAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertDiscussionAllUpdatablePropertiesEquals(Discussion expected, Discussion actual) {
        assertDiscussionUpdatableFieldsEquals(expected, actual);
        assertDiscussionUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertDiscussionAutoGeneratedPropertiesEquals(Discussion expected, Discussion actual) {
        assertThat(expected)
            .as("Verify Discussion auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertDiscussionUpdatableFieldsEquals(Discussion expected, Discussion actual) {
        assertThat(expected)
            .as("Verify Discussion relevant properties")
            .satisfies(e -> assertThat(e.getTopic()).as("check topic").isEqualTo(actual.getTopic()))
            .satisfies(e -> assertThat(e.getDetails()).as("check details").isEqualTo(actual.getDetails()))
            .satisfies(e -> assertThat(e.getCreatedBy()).as("check createdBy").isEqualTo(actual.getCreatedBy()))
            .satisfies(e -> assertThat(e.getCreatedDate()).as("check createdDate").isEqualTo(actual.getCreatedDate()))
            .satisfies(e -> assertThat(e.getLastModifiedBy()).as("check lastModifiedBy").isEqualTo(actual.getLastModifiedBy()))
            .satisfies(e -> assertThat(e.getLastModifiedDate()).as("check lastModifiedDate").isEqualTo(actual.getLastModifiedDate()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertDiscussionUpdatableRelationshipsEquals(Discussion expected, Discussion actual) {
        assertThat(expected)
            .as("Verify Discussion relationships")
            .satisfies(e -> assertThat(e.getCourse()).as("check course").isEqualTo(actual.getCourse()));
    }
}