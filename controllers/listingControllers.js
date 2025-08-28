import Listing from "../models/listingSchema.js";

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
