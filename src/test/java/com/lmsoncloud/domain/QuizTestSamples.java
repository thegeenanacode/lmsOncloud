package com.lmsoncloud.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class QuizTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Quiz getQuizSample1() {
        return new Quiz().id(1L).title("title1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Quiz getQuizSample2() {
        return new Quiz().id(2L).title("title2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Quiz getQuizRandomSampleGenerator() {
        return new Quiz()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
