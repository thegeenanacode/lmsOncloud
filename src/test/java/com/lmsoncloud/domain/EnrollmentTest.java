package com.lmsoncloud.domain;

import static com.lmsoncloud.domain.AppUserTestSamples.*;
import static com.lmsoncloud.domain.CourseTestSamples.*;
import static com.lmsoncloud.domain.EnrollmentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.lmsoncloud.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EnrollmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Enrollment.class);
        Enrollment enrollment1 = getEnrollmentSample1();
        Enrollment enrollment2 = new Enrollment();
        assertThat(enrollment1).isNotEqualTo(enrollment2);

        enrollment2.setId(enrollment1.getId());
        assertThat(enrollment1).isEqualTo(enrollment2);

        enrollment2 = getEnrollmentSample2();
        assertThat(enrollment1).isNotEqualTo(enrollment2);
    }

    @Test
    void userTest() {
        Enrollment enrollment = getEnrollmentRandomSampleGenerator();
        AppUser appUserBack = getAppUserRandomSampleGenerator();

        enrollment.setUser(appUserBack);
        assertThat(enrollment.getUser()).isEqualTo(appUserBack);

        enrollment.user(null);
        assertThat(enrollment.getUser()).isNull();
    }

    @Test
    void courseTest() {
        Enrollment enrollment = getEnrollmentRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        enrollment.setCourse(courseBack);
        assertThat(enrollment.getCourse()).isEqualTo(courseBack);

        enrollment.course(null);
        assertThat(enrollment.getCourse()).isNull();
    }

    @Test
    void appUserTest() {
        Enrollment enrollment = getEnrollmentRandomSampleGenerator();
        AppUser appUserBack = getAppUserRandomSampleGenerator();

        enrollment.setAppUser(appUserBack);
        assertThat(enrollment.getAppUser()).isEqualTo(appUserBack);
        assertThat(appUserBack.getEnrollment()).isEqualTo(enrollment);

        enrollment.appUser(null);
        assertThat(enrollment.getAppUser()).isNull();
        assertThat(appUserBack.getEnrollment()).isNull();
    }
}
