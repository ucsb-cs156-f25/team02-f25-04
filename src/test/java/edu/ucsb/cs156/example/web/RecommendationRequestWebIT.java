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
public class RecommendationRequestWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_recommendationRequest() throws Exception {
    setupUser(true);

    page.getByText("Recommendation Requests").click();

    page.getByText("Create RecommendationRequest").click();
    assertThat(page.getByText("Create New recommendationRequests")).isVisible();
    page.getByLabel("Requester Email").fill("student@ucsb.edu");
    page.getByLabel("Professor Email").fill("advisor@ucsb.edu");
    page.getByLabel("Explanation").fill("Recommendation for scholarship");
    page.getByLabel("Date Requested").fill("2022-04-20T09:30");
    page.getByLabel("Date Needed").fill("2022-04-20T09:30");
    page.getByLabel("Done").check();

    page.getByTestId("RecommendationRequestForm-submit").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
        .hasText("Recommendation for scholarship");

    page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit RecommendationRequests")).isVisible();
    page.getByTestId("RecommendationRequestForm-requesterEmail").fill("max@ucsb.edu");
    page.getByText("Update").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("max@ucsb.edu");
    page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-id")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_recommendationRequest() throws Exception {
    setupUser(false);

    page.getByText("Recommendation Requests").click();

    assertThat(page.getByText("Create RecommendationRequest")).not().isVisible();
    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-id")).not().isVisible();
  }
}
