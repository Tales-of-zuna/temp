import mongoose from "mongoose";
let isConnected = false;
const ConnectMongoDB = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    return console.log("Already connected to mongoDB");
  }
  try {
    await mongoose.connect(
      "mongodb+srv://zuna:Kurama05@sandbox-test.zj14uv4.mongodb.net/",
    );
    isConnected = true;
    console.log("Connected to mongoDB");
  } catch (error) {
    console.log(error);
  }
};

export default ConnectMongoDB;
