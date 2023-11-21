import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";

export async function GET(req, context) {
  await dbConnect();

  try {
    const product = await Product.findOne({ slug: context.params.slug })
      .populate("category", "name slug") // before accessing category and tags, make sure .populate() is used in api routes and ref: 'Category' models are imported in `Product` model
      .populate("tags", "name slug") // populate two fields `name` and `slug` from `Category` model
      .populate({
        path: "ratings.postedBy",
        model: "User",
        select: "name",
      });
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json(
      {
        err: err.message,
      },
      { status: 500 }
    );
  }
}
