package com.lmsoncloud.domain;

import static com.lmsoncloud.domain.AppUserTestSamples.*;
import static com.lmsoncloud.domain.EnrollmentTestSamples.*;
import static com.lmsoncloud.domain.GradebookTestSamples.*;
import static com.lmsoncloud.domain.MessageTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.lmsoncloud.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AppUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AppUser.class);
        AppUser appUser1 = getAppUserSample1();
        AppUser appUser2 = new AppUser();
        assertThat(appUser1).isNotEqualTo(appUser2);

        appUser2.setId(appUser1.getId());
        assertThat(appUser1).isEqualTo(appUser2);

        appUser2 = getAppUserSample2();
        assertThat(appUser1).isNotEqualTo(appUser2);
    }

    @Test
    void enrollmentTest() {
        AppUser appUser = getAppUserRandomSampleGenerator();
        Enrollment enrollmentBack = getEnrollmentRandomSampleGenerator();

        appUser.setEnrollment(enrollmentBack);
        assertThat(appUser.getEnrollment()).isEqualTo(enrollmentBack);

        appUser.enrollment(null);
        assertThat(appUser.getEnrollment()).isNull();
    }

    @Test
    void messageTest() {
        AppUser appUser = getAppUserRandomSampleGenerator();
        Message messageBack = getMessageRandomSampleGenerator();

        appUser.addMessage(messageBack);
        assertThat(appUser.getMessages()).containsOnly(messageBack);
        assertThat(messageBack.getUser()).isEqualTo(appUser);

        appUser.removeMessage(messageBack);
        assertThat(appUser.getMessages()).doesNotContain(messageBack);
        assertThat(messageBack.getUser()).isNull();

        appUser.messages(new HashSet<>(Set.of(messageBack)));
        assertThat(appUser.getMessages()).containsOnly(messageBack);
        assertThat(messageBack.getUser()).isEqualTo(appUser);

        appUser.setMessages(new HashSet<>());
        assertThat(appUser.getMessages()).doesNotContain(messageBack);
        assertThat(messageBack.getUser()).isNull();
    }

    @Test
    void gradebookTest() {
        AppUser appUser = getAppUserRandomSampleGenerator();
        Gradebook gradebookBack = getGradebookRandomSampleGenerator();

        appUser.setGradebook(gradebookBack);
        assertThat(appUser.getGradebook()).isEqualTo(gradebookBack);
        assertThat(gradebookBack.getStudent()).isEqualTo(appUser);

        appUser.gradebook(null);
        assertThat(appUser.getGradebook()).isNull();
        assertThat(gradebookBack.getStudent()).isNull();
    }
}
