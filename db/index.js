import mongoose from "mongoose";
import { Store } from "../models/shop.model.js";

const DB_Connection = async () => {
  try {
    const connectionIntance = await mongoose.connect(process.env.DB_URL);
    // await Store.syncIndexes(); //  syncIndexes() ফাংশনটি MongoDB-কে বাধ্য করবে আপনার বর্তমান স্কিমা অনুযায়ী নতুন করে Unique Index তৈরি করতে।
    console.log(
      `MONGODB Connected successfully !! DB Host ${connectionIntance.connection.host}`,
    );
  } catch (error) {
    console.error(`Mongo DB connection faild ${error}`);
    process.exit(1);
  }
};

export default DB_Connection;
