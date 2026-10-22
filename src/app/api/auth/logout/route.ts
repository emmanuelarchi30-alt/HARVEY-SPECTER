import { clearAuthCookie } from "@/lib/auth/cookies";
import { apiResponse } from "@/lib/http";

export async function POST() {
  const response = apiResponse({
    message: "Sesión cerrada exitosamente",
  });

  clearAuthCookie(response);

  return response;
}
