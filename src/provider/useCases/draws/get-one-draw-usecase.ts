import { MainApiProvider } from "src/provider/MainApiProvider";

const apiAprovider = new MainApiProvider();

export const GetOneDraw = async (drawId: string) => {
  const response = await apiAprovider.request("GET", `/draws/${drawId}/detail`);
  if (response.isFailure) return { error: response.error.message };

  return response.value;
};
