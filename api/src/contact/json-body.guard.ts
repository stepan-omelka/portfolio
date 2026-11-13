import { type CanActivate, type ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { ApiError } from "../api-error.js";

/**
 * Requiring JSON makes browsers send a CORS preflight for cross-site posts, which this API
 * doesn't answer, so other websites can't submit the form on a visitor's behalf.
 */
@Injectable()
export class JsonBodyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.headers["content-type"]?.startsWith("application/json")) {
      throw new ApiError("invalid", HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }
    return true;
  }
}
