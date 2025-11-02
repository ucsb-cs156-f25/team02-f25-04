import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/HelpRequestUtils";
import mockConsole from "tests/testutils/mockConsole";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

describe("HelpRequestUtils", () => {
  describe("onDeleteSuccess", () => {
    test("It puts the message on console.log and in a toast", () => {
      // arrange
      const restoreConsole = mockConsole();

      // act
      onDeleteSuccess("Help Request deleted successfully.");

      // assert
      expect(mockToast).toHaveBeenCalledWith(
        "Help Request deleted successfully.",
      );
      expect(console.log).toHaveBeenCalled();
      const message = console.log.mock.calls[0][0];
      expect(message).toMatch("Help Request deleted successfully.");

      restoreConsole();
    });
  });
  describe("cellToAxiosParamsDelete", () => {
    test("It returns the correct params", () => {
      // arrange
      const cell = { row: { original: { id: 17 } } };

      // act
      const result = cellToAxiosParamsDelete(cell);

      // assert
      expect(result).toEqual({
        url: "/api/HelpRequest",
        method: "DELETE",
        params: { id: 17 },
      });
    });
  });
});
