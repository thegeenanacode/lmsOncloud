package com.lmsoncloud.domain;

import static com.lmsoncloud.domain.CourseTestSamples.*;
import static com.lmsoncloud.domain.DiscussionTestSamples.*;
import static com.lmsoncloud.domain.ModuleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.lmsoncloud.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CourseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Course.class);
        Course course1 = getCourseSample1();
        Course course2 = new Course();
        assertThat(course1).isNotEqualTo(course2);

        course2.setId(course1.getId());
        assertThat(course1).isEqualTo(course2);

        course2 = getCourseSample2();
        assertThat(course1).isNotEqualTo(course2);
    }

    @Test
    void discussionTest() {
        Course course = getCourseRandomSampleGenerator();
        Discussion discussionBack = getDiscussionRandomSampleGenerator();

        course.addDiscussion(discussionBack);
        assertThat(course.getDiscussions()).containsOnly(discussionBack);
        assertThat(discussionBack.getCourse()).isEqualTo(course);

        course.removeDiscussion(discussionBack);
        assertThat(course.getDiscussions()).doesNotContain(discussionBack);
        assertThat(discussionBack.getCourse()).isNull();

        course.discussions(new HashSet<>(Set.of(discussionBack)));
        assertThat(course.getDiscussions()).containsOnly(discussionBack);
        assertThat(discussionBack.getCourse()).isEqualTo(course);

        course.setDiscussions(new HashSet<>());
        assertThat(course.getDiscussions()).doesNotContain(discussionBack);
        assertThat(discussionBack.getCourse()).isNull();
    }

    @Test
    void moduleTest() {
        Course course = getCourseRandomSampleGenerator();
        Module moduleBack = getModuleRandomSampleGenerator();

        course.addModule(moduleBack);
        assertThat(course.getModules()).containsOnly(moduleBack);

        course.removeModule(moduleBack);
        assertThat(course.getModules()).doesNotContain(moduleBack);

        course.modules(new HashSet<>(Set.of(moduleBack)));
        assertThat(course.getModules()).containsOnly(moduleBack);

        course.setModules(new HashSet<>());
        assertThat(course.getModules()).doesNotContain(moduleBack);
    }
}
