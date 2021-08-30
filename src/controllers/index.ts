import { Response } from 'express';
import mongoose from 'mongoose';
import { CUSTOM_VALIDATION } from '@src/models/user';
import logger from '@src/logger';
import ApiError, { APIError } from '@src/util/errors/api-error';

export abstract class BaseController {
  protected sendCreateUpdatedErrorResponse(
    res: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const duplicatedKindErrors = Object.values(error.errors).filter((err) => {
        if (
          err instanceof mongoose.Error.ValidatorError ||
          err instanceof mongoose.Error.CastError
        ) {
          return err.kind === CUSTOM_VALIDATION.DUPLICATED;
        } else {
          return null;
        }
      });
      if (duplicatedKindErrors.length) {
        res
          .status(409)
          .send(ApiError.format({ code: 409, message: error.message }));
      } else {
        res
          .status(400)
          .send(ApiError.format({ code: 400, message: error.message }));
      }
    } else {
      logger.error(error);
      res
        .status(500)
        .send(ApiError.format({ code: 500, message: 'Something went wrong' }));
    }
  }

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }
}
