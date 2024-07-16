package com.lmsoncloud.domain;

import static com.lmsoncloud.domain.ContentLibraryTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.lmsoncloud.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ContentLibraryTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ContentLibrary.class);
        ContentLibrary contentLibrary1 = getContentLibrarySample1();
        ContentLibrary contentLibrary2 = new ContentLibrary();
        assertThat(contentLibrary1).isNotEqualTo(contentLibrary2);

        contentLibrary2.setId(contentLibrary1.getId());
        assertThat(contentLibrary1).isEqualTo(contentLibrary2);

        contentLibrary2 = getContentLibrarySample2();
        assertThat(contentLibrary1).isNotEqualTo(contentLibrary2);
    }
}
