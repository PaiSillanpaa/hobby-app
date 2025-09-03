import Listing from "../models/listingSchema.js";
import { checkJwt } from "../middleware/jwt.js";

export const createListing = async (request, response) => {
  const { title, text } = request.body;
  console.log(title);
  console.log(text);

  if (!title || !text) {
    console.log("error creating listing, empty fields!");
    return response.status(400).send("Title and description are required!");
  }

  try {
    const newListing = new Listing({
      listingTitle: title,
      listingText: text,
    });

    await newListing.save();
    response.send("Listing created succesfully!");
  } catch (error) {
    console.error("Server error from listing creation: ", error.message);
    return response.status(500).send("There was an error creating a listing!");
  }
};

export const getListings = async (request, response) => {
  try {
    const listings = await Listing.find();

    const formattedListings = listings.map((listing) => ({
      id: listing._id,
      title: listing.listingTitle,
      text: listing.listingText,
      views: listing.views,
    }));

    return response.send(formattedListings);
  } catch (error) {
    console.log(error, "error retrieving listings");
    return response.status(500).send("error retrieving listings!");
  }
};
