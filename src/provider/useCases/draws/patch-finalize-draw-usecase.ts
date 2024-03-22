import { MainApiProvider } from "src/provider/MainApiProvider";

const apiAprovider = new MainApiProvider();

export const PatchFinalizeDraw = async (drawId: string, ticketNumber: string) => {
  const response = await apiAprovider.request(
    "PATCH",
    `/draws/${drawId}/winner-ticket/${ticketNumber}`
  );
  if (response.isFailure) return { error: response.error.message };

  return response.value;
};
