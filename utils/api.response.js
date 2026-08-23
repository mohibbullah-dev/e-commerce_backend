class apiResponse {
  constructor(statusCode, message = "successed", data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.successed = statusCode < 400;
  }
}

export { apiResponse };
