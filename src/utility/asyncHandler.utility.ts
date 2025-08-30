import type { Request, Response, NextFunction } from "express"

export const asyncHandler = (fn: Function) => (
  async (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(err => next(err))
  }
)
