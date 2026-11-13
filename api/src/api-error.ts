import { HttpException } from "@nestjs/common";

/** An error the API answers with the given status and the body `{ error }`. */
export class ApiError extends HttpException {
  constructor(error: string, status: number) {
    super({ error }, status);
  }
}
