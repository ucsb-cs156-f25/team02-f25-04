import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticleForm from "main/components/Articles/ArticleForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("ArticleForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <ArticleForm />
      </Router>,
    );
    await screen.findByText(/Title/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Title/)).toBeInTheDocument();
  });

  test("renders correctly when passing in an Article", async () => {
    render(
      <Router>
        <ArticleForm initialContents={articlesFixtures.oneArticle} />
      </Router>,
    );
    await screen.findByTestId(/ArticleForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/ArticleForm-id/)).toHaveValue("1");
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <Router>
        <ArticleForm />
      </Router>,
    );
    await screen.findByTestId("ArticleForm-title");
    const dateAddedField = screen.getByTestId("ArticleForm-dateAdded");
    const submitButton = screen.getByTestId("ArticleForm-submit");

    fireEvent.change(dateAddedField, { target: { value: "not-an-iso-date" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Date Added is required./);
    expect(
      screen.getByText(/Date Added is required./),
    ).toBeInTheDocument();
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <ArticleForm />
      </Router>,
    );
    await screen.findByTestId("ArticleForm-submit");
    const submitButton = screen.getByTestId("ArticleForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Title is required./);
    expect(screen.getByText(/Title is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Added is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <ArticleForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("ArticleForm-title");

    const titleField = screen.getByTestId("ArticleForm-title");
    const urlField = screen.getByTestId("ArticleForm-url");
    const explanationField = screen.getByTestId("ArticleForm-explanation");
    const emailField = screen.getByTestId("ArticleForm-email");
    const dateAddedField = screen.getByTestId("ArticleForm-dateAdded");
    const submitButton = screen.getByTestId("ArticleForm-submit");

    fireEvent.change(titleField, { target: { value: "Test title" } });
    fireEvent.change(urlField, { target: { value: "test.com" } });
    fireEvent.change(explanationField, { target: { value: "test explanation" } });
    fireEvent.change(emailField, { target: { value: "test@test.com" } });
    fireEvent.change(dateAddedField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Title is required./),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date Added is required./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <ArticleForm />
      </Router>,
    );
    await screen.findByTestId("ArticleForm-cancel");
    const cancelButton = screen.getByTestId("ArticleForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
