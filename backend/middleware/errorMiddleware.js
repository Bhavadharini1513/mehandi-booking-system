const notFound = (req, res, next) => {
  res.status(404);

  next(new Error("Route Not Found"));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
