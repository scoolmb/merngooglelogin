class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);

    // Set the name for your custom error class
    this.name = this.constructor.name;

    // Optional: You can add a status code property to your custom error
    this.statusCode = statusCode || 500;

    // Capture the stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;

