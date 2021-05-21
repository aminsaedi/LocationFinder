const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://aminsaedi:25251818@mongoosetraining.9ioyw.mongodb.net/locationFinder?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connect to database"))
  .catch((error) => console.log(error));
