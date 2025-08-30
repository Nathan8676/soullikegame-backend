import * as z from "zod"

export interface IApiResponse<T> {
  data: T
  statusCode: number
  message: string
  success: boolean
}



class ApiResponse<T> implements IApiResponse<T> {
  data!: T
  statusCode!: number
  message: string = ''
  success!: boolean
  constructor(data: T, statusCode: number, message?: string) {
    this.data = data
    this.statusCode = statusCode
    if (message) this.message = message
    this.success = statusCode < 400
  }
}

export default ApiResponse
