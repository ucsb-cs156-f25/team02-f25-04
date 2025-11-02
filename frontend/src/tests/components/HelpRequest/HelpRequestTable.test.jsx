import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import HelpRequestTable from "main/components/HelpRequest/HelpRequestTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UserTable tests", () => {
  const queryClient = new QueryClient();
  const expectedHeaders = [
    "id",
    "Requester Email",
    "Team Id",
    "Table Or Breakout Room",
    "Request Time (ISO Format)",
    "Explanation",
    "Solved",
  ];
  const expectedFields = [
    "id",
    "requesterEmail",
    "teamId",
    "tableOrBreakoutRoom",
    "requestTime",
    "explanation",
    "solved",
  ];
  const testId = "HelpRequestTable";

  test("Has the expected column headers, content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable
            helpRequests={helpRequestFixtures.threeHelpRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`),
    ).toHaveTextContent("alicegaucho@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-teamId`),
    ).toHaveTextContent("01");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-tableOrBreakoutRoom`),
    ).toHaveTextContent("01");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requestTime`),
    ).toHaveTextContent("2025-10-31T12:00:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-explanation`),
    ).toHaveTextContent("Need help with git:sync on dokku.");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-solved`),
    ).toHaveTextContent("false");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-requesterEmail`),
    ).toHaveTextContent("bobgaucho@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-teamId`),
    ).toHaveTextContent("08");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-tableOrBreakoutRoom`),
    ).toHaveTextContent("08");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-requestTime`),
    ).toHaveTextContent("2025-11-01T20:00:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-explanation`),
    ).toHaveTextContent("Cant login with Google account on localhost.");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-solved`),
    ).toHaveTextContent("false");

    const editButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).not.toBeInTheDocument();
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable
            helpRequests={helpRequestFixtures.threeHelpRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`),
    ).toHaveTextContent("alicegaucho@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-teamId`),
    ).toHaveTextContent("01");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-tableOrBreakoutRoom`),
    ).toHaveTextContent("01");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requestTime`),
    ).toHaveTextContent("2025-10-31T12:00:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-explanation`),
    ).toHaveTextContent("Need help with git:sync on dokku.");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-solved`),
    ).toHaveTextContent("false");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-requesterEmail`),
    ).toHaveTextContent("bobgaucho@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-teamId`),
    ).toHaveTextContent("08");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-tableOrBreakoutRoom`),
    ).toHaveTextContent("08");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-requestTime`),
    ).toHaveTextContent("2025-11-01T20:00:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-explanation`),
    ).toHaveTextContent("Cant login with Google account on localhost.");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-solved`),
    ).toHaveTextContent("false");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable
            helpRequests={helpRequestFixtures.threeHelpRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`HelpRequestTable-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const editButton = screen.getByTestId(
      `HelpRequestTable-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/HelpRequest/edit/1"),
    );
  });

  test("Delete button calls delete callback for admin user", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/HelpRequest")
      .reply(200, { message: "Help Request deleted successfully." });

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestTable
            helpRequests={helpRequestFixtures.threeHelpRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert - check that the expected content is rendered

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("1");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`),
      ).toHaveTextContent("alicegaucho@ucsb.edu");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-teamId`),
      ).toHaveTextContent("01");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-tableOrBreakoutRoom`),
      ).toHaveTextContent("01");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-requestTime`),
      ).toHaveTextContent("2025-10-31T12:00:00");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-explanation`),
      ).toHaveTextContent("Need help with git:sync on dokku.");
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-solved`),
      ).toHaveTextContent("false");
    });

    const deleteButton = screen.getByTestId(
      `HelpRequestTable-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);

    // assert - check that the delete endpoint was called

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });
  });
});
