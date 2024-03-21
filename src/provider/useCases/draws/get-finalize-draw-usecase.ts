import { MainApiProvider } from "src/provider/MainApiProvider";

const apiAprovider = new MainApiProvider();

export const GetFinalizeDraw = async (drawId: string, ticketNumber: string) => {
  const response = await apiAprovider.request(
    "GET",
    `/tickets/draws/${drawId}/tickets/${ticketNumber}/ticket-status`
  );
  if (response.isFailure) return { error: response.error.message };

  return response.value;
};
