import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
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

describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {
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
          <UCSBDiningCommonsMenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode")
      ).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const menuItem = {
      id: 42,
      diningCommonsCode: "DLG",
      name: "Chicken Tenders",
      station: "Grill",
    };

    axiosMock.onPost("/api/ucsbmenuitem/post").reply(202, menuItem);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBDiningCommonsMenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode")
      ).toBeInTheDocument();
    });

    const diningCommonsCodeField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-diningCommonsCode"
    );
    const nameField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-name"
    );
    const stationField = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-station"
    );
    const submitButton = screen.getByTestId(
      "UCSBDiningCommonsMenuItemForm-submit"
    );

    fireEvent.change(diningCommonsCodeField, { target: { value: "DLG" } });
    fireEvent.change(nameField, { target: { value: "Chicken Tenders" } });
    fireEvent.change(stationField, { target: { value: "Grill" } });

    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      diningCommonsCode: "DLG",
      name: "Chicken Tenders",
      station: "Grill",
    });

    expect(mockToast).toBeCalledWith(
      "New UCSBDiningCommonsMenuItem Created - id: 42 name: Chicken Tenders"
    );
    expect(mockNavigate).toBeCalledWith({ to: "/diningcommonsmenuitem" });
  });
});
