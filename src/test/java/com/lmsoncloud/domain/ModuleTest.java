package com.lmsoncloud.domain;

import static com.lmsoncloud.domain.CourseTestSamples.*;
import static com.lmsoncloud.domain.LessonTestSamples.*;
import static com.lmsoncloud.domain.ModuleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.lmsoncloud.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ModuleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Module.class);
        Module module1 = getModuleSample1();
        Module module2 = new Module();
        assertThat(module1).isNotEqualTo(module2);

        module2.setId(module1.getId());
        assertThat(module1).isEqualTo(module2);

        module2 = getModuleSample2();
        assertThat(module1).isNotEqualTo(module2);
    }

    @Test
    void lessonTest() {
        Module module = getModuleRandomSampleGenerator();
        Lesson lessonBack = getLessonRandomSampleGenerator();

        module.addLesson(lessonBack);
        assertThat(module.getLessons()).containsOnly(lessonBack);
        assertThat(lessonBack.getModule()).isEqualTo(module);

        module.removeLesson(lessonBack);
        assertThat(module.getLessons()).doesNotContain(lessonBack);
        assertThat(lessonBack.getModule()).isNull();

        module.lessons(new HashSet<>(Set.of(lessonBack)));
        assertThat(module.getLessons()).containsOnly(lessonBack);
        assertThat(lessonBack.getModule()).isEqualTo(module);

        module.setLessons(new HashSet<>());
        assertThat(module.getLessons()).doesNotContain(lessonBack);
        assertThat(lessonBack.getModule()).isNull();
    }

    @Test
    void courseTest() {
        Module module = getModuleRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        module.addCourse(courseBack);
        assertThat(module.getCourses()).containsOnly(courseBack);
        assertThat(courseBack.getModules()).containsOnly(module);

        module.removeCourse(courseBack);
        assertThat(module.getCourses()).doesNotContain(courseBack);
        assertThat(courseBack.getModules()).doesNotContain(module);

        module.courses(new HashSet<>(Set.of(courseBack)));
        assertThat(module.getCourses()).containsOnly(courseBack);
        assertThat(courseBack.getModules()).containsOnly(module);

        module.setCourses(new HashSet<>());
        assertThat(module.getCourses()).doesNotContain(courseBack);
        assertThat(courseBack.getModules()).doesNotContain(module);
    }
}
