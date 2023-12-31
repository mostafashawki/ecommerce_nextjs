import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";

export async function PUT(req, context) {
  //vercel deployment make serverless function to be stateless, so we need to connect to db every time
  await dbConnect();
  const { delivery_status } = await req.json();

  try {
    const order = await Order.findByIdAndUpdate(
      context.params.orderId,
      {
        delivery_status,
      },
      { new: true }
    );

    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
