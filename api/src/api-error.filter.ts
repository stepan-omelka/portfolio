import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Response } from "express";
import { ApiError } from "./api-error.js";

/**
 * Gives the errors Nest and Express raise themselves - an unknown route, a body that is too large
 * or isn't JSON, a crash - the `{ error }` body that every `ApiError` has.
 */
@Catch()
export class ApiErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof ApiError) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    const status = statusOf(exception);
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }
    response.status(status).json({ error: errorFor(status) });
  }
}

function statusOf(exception: unknown): number {
  if (exception instanceof HttpException) {
    return exception.getStatus();
  }
  // Express's body parser throws plain errors that carry their status, e.g. 413 for a large body.
  if (typeof exception === "object" && exception !== null && "status" in exception) {
    const { status } = exception;
    if (typeof status === "number" && status >= 400 && status < 600) {
      return status;
    }
  }
  return HttpStatus.INTERNAL_SERVER_ERROR;
}

function errorFor(status: number): string {
  if (status === HttpStatus.NOT_FOUND) {
    return "Not found";
  }
  return status >= HttpStatus.INTERNAL_SERVER_ERROR ? "unexpected" : "invalid";
}
