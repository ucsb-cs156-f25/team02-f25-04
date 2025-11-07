package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_organization() throws Exception {
    setupUser(true);

    page.getByText("UCSB Organizations").click();

    page.getByText("Create Organization").click();
    assertThat(page.getByText("Create New Organization")).isVisible();
    page.getByTestId("UCSBOrganizationForm-orgCode").fill("CYB");
    page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("Cybersecurity");
    page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("Cybersecurity-club");
    page.getByTestId("UCSBOrganizationForm-inactive").fill("false");
    page.getByTestId("UCSBOrganizationForm-submit").click();

    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort"))
        .hasText("Cybersecurity");

    page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit UCSB Organization")).isVisible();
    page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("Cybersecuritys");
    page.getByTestId("UCSBOrganizationForm-inactive").fill("false");
    page.getByTestId("UCSBOrganizationForm-submit").click();

    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort"))
        .hasText("Cybersecuritys");

    page.getByTestId("UCSBOrganizationTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_ucsborganization() throws Exception {
    setupUser(false);

    page.getByText("UCSB Organizations").click();

    assertThat(page.getByText("Create Organization")).not().isVisible();
    assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgTranslationShort"))
        .not()
        .isVisible();
  }
}
