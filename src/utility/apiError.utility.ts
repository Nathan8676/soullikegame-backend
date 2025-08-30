import * as z from "zod"

const apiErrorsSchema = z.object({
  statusCode: z.number(),
  errors: z.array(z.string()),
  success: z.boolean(),
  stack: z.string().or(z.undefined()),
})

export type IApiErrors = z.infer<typeof apiErrorsSchema>

class ApiErrors extends Error implements IApiErrors {
  statusCode: number
  errors: Array<string>
  success: boolean
  stack: string | undefined
  constructor(statusCode: number, message: string, errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiErrors;
