package com.lmsoncloud.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class GradebookTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Gradebook getGradebookSample1() {
        return new Gradebook().id(1L).gradeValue("gradeValue1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Gradebook getGradebookSample2() {
        return new Gradebook().id(2L).gradeValue("gradeValue2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Gradebook getGradebookRandomSampleGenerator() {
        return new Gradebook()
            .id(longCount.incrementAndGet())
            .gradeValue(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
