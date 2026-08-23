import mongoose from "mongoose";

const DB_Connection = async () => {
  try {
    const connectionIntance = await mongoose.connect(process.env.DB_URL);
    console.log(
      `MONGODB Connected successfully !! DB Host ${connectionIntance.connection.host}`,
    );
  } catch (error) {
    console.error(`Mongo DB connection faild ${error}`);
    process.exit(1);
  }
};

export default DB_Connection;
