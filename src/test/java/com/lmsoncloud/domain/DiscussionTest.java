package com.lmsoncloud.domain;

import static com.lmsoncloud.domain.CourseTestSamples.*;
import static com.lmsoncloud.domain.DiscussionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.lmsoncloud.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DiscussionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Discussion.class);
        Discussion discussion1 = getDiscussionSample1();
        Discussion discussion2 = new Discussion();
        assertThat(discussion1).isNotEqualTo(discussion2);

        discussion2.setId(discussion1.getId());
        assertThat(discussion1).isEqualTo(discussion2);

        discussion2 = getDiscussionSample2();
        assertThat(discussion1).isNotEqualTo(discussion2);
    }

    @Test
    void courseTest() {
        Discussion discussion = getDiscussionRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        discussion.setCourse(courseBack);
        assertThat(discussion.getCourse()).isEqualTo(courseBack);

        discussion.course(null);
        assertThat(discussion.getCourse()).isNull();
    }
}
