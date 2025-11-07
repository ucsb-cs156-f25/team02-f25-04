import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestsCreatePage from "main/pages/RecommendationRequests/RecommendationRequestsCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("RecommendationRequestsCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const recommendationRequest = {
      id: 1,
      requesterEmail: "test1@ucsb.edu",
      professorEmail: "prof1@ucsb.edu",
      explanation: "i want more mexican food",
      dateRequested: "2022-01-03T00:10:01",
      dateNeeded: "2022-01-03T00:10:02",
      done: true,
    };

    axiosMock
      .onPost("/api/recommendationrequests/post")
      .reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    const requesterEmailField = screen.getByLabelText("Requester Email");
    const professorEmailField = screen.getByLabelText("Professor Email");
    const explanationField = screen.getByLabelText("Explanation");
    const dateRequestedField = screen.getByLabelText(
      "Date Requested (iso format)",
    );
    const dateNeededField = screen.getByLabelText("Date Needed (iso format)");
    const doneField = screen.getByLabelText("Done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(requesterEmailField, {
      target: { value: "test1@ucsb.edu" },
    });
    fireEvent.change(professorEmailField, {
      target: { value: "prof1@ucsb.edu" },
    });
    fireEvent.change(explanationField, {
      target: { value: "i want more mexican food" },
    });
    fireEvent.change(dateRequestedField, {
      target: { value: "2022-01-03T00:10" },
    });
    fireEvent.change(dateNeededField, {
      target: { value: "2022-01-03T00:10" },
    });
    fireEvent.change(doneField, { target: { checked: false } });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "test1@ucsb.edu",
      professorEmail: "prof1@ucsb.edu",
      explanation: "i want more mexican food",
      dateRequested: "2022-01-03T00:10",
      dateNeeded: "2022-01-03T00:10",
      done: false,
    });

    expect(mockToast).toHaveBeenCalledWith(
      "New recommendationRequest Created - id: 1 requesterEmail: test1@ucsb.edu",
    );
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/recommendationRequests",
    });
  });
});
