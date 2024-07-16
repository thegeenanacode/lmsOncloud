package com.lmsoncloud.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class LessonTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Lesson getLessonSample1() {
        return new Lesson().id(1L).title("title1").videoUrl("videoUrl1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Lesson getLessonSample2() {
        return new Lesson().id(2L).title("title2").videoUrl("videoUrl2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Lesson getLessonRandomSampleGenerator() {
        return new Lesson()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .videoUrl(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
