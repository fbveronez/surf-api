import { Response } from 'express';
import mongoose from 'mongoose';
import { CUSTOM_VALIDATION } from '@src/models/user';

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
        res.status(409).send({ code: 409, error: error.message });
      } else {
        res.status(422).send({ code: 422, error: error.message });
      }
    } else {
      res.status(500).send({ code: 500, error: 'Something went wrong' });
    }
  }
}
