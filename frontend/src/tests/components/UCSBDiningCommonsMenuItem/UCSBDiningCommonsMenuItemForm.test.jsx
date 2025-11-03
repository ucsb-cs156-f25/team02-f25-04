import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
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

describe("UCSBDiningCommonsMenuItemForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>
    );
    await screen.findByText(/Dining Commons Code/);
    expect(screen.getByText(/Dining Commons Code/)).toBeInTheDocument();
    expect(screen.getByText(/Create/)).toBeInTheDocument();
  });

  test("renders correctly when passing in initial contents", async () => {
    const initialContents = {
      id: 1,
      diningCommonsCode: "DLG",
      name: "Chicken Tenders",
      station: "Grill",
    };

    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm initialContents={initialContents} />
      </Router>
    );

    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");
    expect(screen.getByTestId("UCSBDiningCommonsMenuItemForm-id")).toHaveValue("1");
    expect(screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode")).toHaveValue("DLG");
    expect(screen.getByTestId("UCSBDiningCommonsMenuItemForm-name")).toHaveValue("Chicken Tenders");
    expect(screen.getByTestId("UCSBDiningCommonsMenuItemForm-station")).toHaveValue("Grill");
  });

  test("shows error messages on missing input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>
    );

    const submitButton = await screen.findByTestId("UCSBDiningCommonsMenuItemForm-submit");
    fireEvent.click(submitButton);

    await screen.findByText(/DiningCommonsCode is required/);
    expect(screen.getByText(/Name is required/)).toBeInTheDocument();
    expect(screen.getByText(/Station is required/)).toBeInTheDocument();
  });

  test("calls submitAction on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
      </Router>
    );

    const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
    const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

    fireEvent.change(diningCommonsCodeField, { target: { value: "DLG" } });
    fireEvent.change(nameField, { target: { value: "Pancakes" } });
    fireEvent.change(stationField, { target: { value: "Breakfast" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
  });

  test("navigates back when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>
    );

    const cancelButton = await screen.findByTestId("UCSBDiningCommonsMenuItemForm-cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
