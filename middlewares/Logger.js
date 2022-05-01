const logger = (req, res, next) => {
  req.hello = "Hello world";
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  next();
};

module.exports = logger;
