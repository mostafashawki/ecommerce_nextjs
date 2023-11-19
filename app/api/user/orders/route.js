import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import { currentUser } from "@/utils/currentUser";

//here is the home for the API route
export async function GET(req) {
  //every API route on vercel is a serverless function, so we need to connect to the database
  await dbConnect();

  try {
    const user = await currentUser();
    const orders = await Order.find({ userId: user._id }).sort({
      createdAt: -1,
    });
    return NextResponse.json(orders);
  } catch (err) {
    console.log(err);
    return NextResponse.json(err, { status: 500 });
  }
}
