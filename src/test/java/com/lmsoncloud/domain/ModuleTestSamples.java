package com.lmsoncloud.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ModuleTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Module getModuleSample1() {
        return new Module().id(1L).title("title1").createdBy("createdBy1").lastModifiedBy("lastModifiedBy1");
    }

    public static Module getModuleSample2() {
        return new Module().id(2L).title("title2").createdBy("createdBy2").lastModifiedBy("lastModifiedBy2");
    }

    public static Module getModuleRandomSampleGenerator() {
        return new Module()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString())
            .lastModifiedBy(UUID.randomUUID().toString());
    }
}
