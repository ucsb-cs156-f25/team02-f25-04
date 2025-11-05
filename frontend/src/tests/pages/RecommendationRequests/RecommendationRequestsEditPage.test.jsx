import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import RecommendationRequestsEditPage from "main/pages/RecommendationRequests/RecommendationRequestsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "tests/testutils/mockConsole";
import { beforeEach, afterEach } from "vitest";

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
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("RecommendationRequestsEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 17 } })
        .timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText(/Welcome/);
      await screen.findByText("Edit RecommendationRequests");
      expect(
        screen.queryByTestId("RecommendationRequestForm-id"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          requesterEmail: "test1@ucsb.edu",
          professorEmail: "prof1@ucsb.edu",
          explanation: "i want more mexican food",
          dateRequested: "2022-01-03T00:10:01",
          dateNeeded: "2022-01-03T00:10:01",
          done: true,
        });
      axiosMock.onPut("/api/recommendationrequests").reply(200, {
        id: 17,
        requesterEmail: "test1@ucsb.edu",
        professorEmail: "prof1@ucsb.edu",
        explanation: "i want more chinese food",
        dateRequested: "2022-01-03T00:10:01",
        dateNeeded: "2022-01-03T00:10:01",
        done: true,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText(/Welcome/);
      await screen.findByTestId("RecommendationRequestForm-id");
      expect(
        screen.getByTestId("RecommendationRequestForm-id"),
      ).toBeInTheDocument();
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByLabelText("Requester Email");
      const professorEmailField = screen.getByLabelText("Professor Email");
      const explanationField = screen.getByLabelText("Explanation");
      const dateRequestedField = screen.getByLabelText(
        "Date Requested (iso format)",
      );
      const dateNeededField = screen.getByLabelText("Date Needed (iso format)");
      const doneField = screen.getByLabelText("Done");
      const submitButton = screen.getByText("Update");

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("test1@ucsb.edu");
      expect(professorEmailField).toHaveValue("prof1@ucsb.edu");
      expect(explanationField).toHaveValue("i want more mexican food");
      expect(dateRequestedField).toHaveValue("2022-01-03T00:10");
      expect(dateNeededField).toHaveValue("2022-01-03T00:10");
      expect(doneField).toBeChecked("true");
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByLabelText("Requester Email");
      const professorEmailField = screen.getByLabelText("Professor Email");
      const explanationField = screen.getByLabelText("Explanation");
      const dateRequestedField = screen.getByLabelText(
        "Date Requested (iso format)",
      );
      const dateNeededField = screen.getByLabelText("Date Needed (iso format)");
      const doneField = screen.getByLabelText("Done");
      const submitButton = screen.getByText("Update");

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("test1@ucsb.edu");
      expect(professorEmailField).toHaveValue("prof1@ucsb.edu");
      expect(explanationField).toHaveValue("i want more mexican food");
      expect(dateRequestedField).toHaveValue("2022-01-03T00:10");
      expect(dateNeededField).toHaveValue("2022-01-03T00:10");
      expect(doneField).toBeChecked("true");

      expect(submitButton).toBeInTheDocument();

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

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "RecommendationRequest Updated - id: 17 requesterEmail: test1@ucsb.edu",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/recommendationRequests" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "test1@ucsb.edu",
          professorEmail: "prof1@ucsb.edu",
          explanation: "i want more mexican food",
          dateRequested: "2022-01-03T00:10",
          dateNeeded: "2022-01-03T00:10",
          done: true,
        }),
      ); // posted object
    });
  });
});
