package vn.infodation.intern.group1.mas.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Managed Accessories System.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {
}
