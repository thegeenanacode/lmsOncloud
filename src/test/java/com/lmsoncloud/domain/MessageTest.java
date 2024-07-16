package com.lmsoncloud.domain;

import static com.lmsoncloud.domain.AppUserTestSamples.*;
import static com.lmsoncloud.domain.MessageTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.lmsoncloud.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MessageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Message.class);
        Message message1 = getMessageSample1();
        Message message2 = new Message();
        assertThat(message1).isNotEqualTo(message2);

        message2.setId(message1.getId());
        assertThat(message1).isEqualTo(message2);

        message2 = getMessageSample2();
        assertThat(message1).isNotEqualTo(message2);
    }

    @Test
    void userTest() {
        Message message = getMessageRandomSampleGenerator();
        AppUser appUserBack = getAppUserRandomSampleGenerator();

        message.setUser(appUserBack);
        assertThat(message.getUser()).isEqualTo(appUserBack);

        message.user(null);
        assertThat(message.getUser()).isNull();
    }
}
