package vn.infodation.intern.group1;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {

        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("vn.infodation.intern.group1");

        noClasses()
            .that()
                .resideInAnyPackage("vn.infodation.intern.group1.service..")
            .or()
                .resideInAnyPackage("vn.infodation.intern.group1.repository..")
            .should().dependOnClassesThat()
                .resideInAnyPackage("..vn.infodation.intern.group1.web..")
        .because("Services and repositories should not depend on web layer")
        .check(importedClasses);
    }
}
