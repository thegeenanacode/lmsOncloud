package com.lmsoncloud.domain;

import static com.lmsoncloud.domain.LessonTestSamples.*;
import static com.lmsoncloud.domain.ModuleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.lmsoncloud.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LessonTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Lesson.class);
        Lesson lesson1 = getLessonSample1();
        Lesson lesson2 = new Lesson();
        assertThat(lesson1).isNotEqualTo(lesson2);

        lesson2.setId(lesson1.getId());
        assertThat(lesson1).isEqualTo(lesson2);

        lesson2 = getLessonSample2();
        assertThat(lesson1).isNotEqualTo(lesson2);
    }

    @Test
    void moduleTest() {
        Lesson lesson = getLessonRandomSampleGenerator();
        Module moduleBack = getModuleRandomSampleGenerator();

        lesson.setModule(moduleBack);
        assertThat(lesson.getModule()).isEqualTo(moduleBack);

        lesson.module(null);
        assertThat(lesson.getModule()).isNull();
    }
}
