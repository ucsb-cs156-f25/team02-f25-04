import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("MenuItemReviewForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByText(/Item Id/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Item Id/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a MenuItemReview", async () => {
    render(
      <Router>
        <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneMenuItemReview} />
      </Router>,
    );
    await screen.findByTestId(/MenuItemReviewForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/MenuItemReviewForm-id/)).toHaveValue("1");
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-item_id");
    const itemIdField = screen.getByTestId("MenuItemReviewForm-item_id");
    const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewer_email");
    const starsField = screen.getByTestId("MenuItemReviewForm-stars");
    const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
    const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(itemIdField, { target: { value: "a" } });
    fireEvent.change(reviewerEmailField, { target: { value: "a" } });
    fireEvent.change(starsField, { target: { value: "555" } });
    fireEvent.change(commentsField, { target: { value: "a".repeat(256) } });
    fireEvent.change(dateReviewedField, { target: { value: "a" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Item Id must correspond to a valid menu item./);
    expect(screen.getByText(/Item Id must correspond to a valid menu item./)).toBeInTheDocument();
    expect(screen.getByText(/Reviewer Email must be a valid email address./)).toBeInTheDocument();
    expect(screen.getByText(/Stars must be between 1 and 5./)).toBeInTheDocument();
    expect(screen.getByText(/Comments must be at most 255 characters./)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required./)).toBeInTheDocument();
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-submit");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Item Id must correspond to a valid menu item./);
    expect(screen.getByText(/Item Id must correspond to a valid menu item./)).toBeInTheDocument();
    expect(screen.getByText(/Reviewer Email is required./)).toBeInTheDocument();
    expect(screen.getByText(/Stars is required./)).toBeInTheDocument();
    expect(screen.getByText(/Comments is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required./)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <MenuItemReviewForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-item_id");

    const itemIdField = screen.getByTestId("MenuItemReviewForm-item_id");
    const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewer_email");
    const starsField = screen.getByTestId("MenuItemReviewForm-stars");
    const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
    const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(itemIdField, { target: { value: "29" } });
    fireEvent.change(reviewerEmailField, { target: { value: "carumugam@ucsb.edu" } });
    fireEvent.change(starsField, { target: { value: "5" } });
    fireEvent.change(commentsField, { target: { value: "tastes good" } });
    fireEvent.change(dateReviewedField, { target: { value: "2025-11-02T12:00:00" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/Item Id is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Reviewer Email is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Stars is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Comments is required./)).not.toBeInTheDocument();
    expect(screen.queryByText(/Date Reviewed is required./)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-cancel");
    const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
