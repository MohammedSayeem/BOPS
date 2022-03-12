module.exports = (err, req, res, next) => {
  let error;
  console.log(err.message);
  error = { ...err };
  error.message = err.message;
  res.status(404).json({
    status: "error",
    error,
  });
};
