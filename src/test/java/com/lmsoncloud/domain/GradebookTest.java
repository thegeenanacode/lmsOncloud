package com.lmsoncloud.domain;

import static com.lmsoncloud.domain.AppUserTestSamples.*;
import static com.lmsoncloud.domain.GradebookTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.lmsoncloud.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GradebookTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Gradebook.class);
        Gradebook gradebook1 = getGradebookSample1();
        Gradebook gradebook2 = new Gradebook();
        assertThat(gradebook1).isNotEqualTo(gradebook2);

        gradebook2.setId(gradebook1.getId());
        assertThat(gradebook1).isEqualTo(gradebook2);

        gradebook2 = getGradebookSample2();
        assertThat(gradebook1).isNotEqualTo(gradebook2);
    }

    @Test
    void studentTest() {
        Gradebook gradebook = getGradebookRandomSampleGenerator();
        AppUser appUserBack = getAppUserRandomSampleGenerator();

        gradebook.setStudent(appUserBack);
        assertThat(gradebook.getStudent()).isEqualTo(appUserBack);

        gradebook.student(null);
        assertThat(gradebook.getStudent()).isNull();
    }
}
