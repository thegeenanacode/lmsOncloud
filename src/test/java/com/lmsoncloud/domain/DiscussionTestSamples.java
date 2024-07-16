package com.lmsoncloud.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DiscussionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Discussion getDiscussionSample1() {
        return new Discussion().id(1L).topic("topic1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Discussion getDiscussionSample2() {
        return new Discussion().id(2L).topic("topic2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Discussion getDiscussionRandomSampleGenerator() {
        return new Discussion()
            .id(longCount.incrementAndGet())
            .topic(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
