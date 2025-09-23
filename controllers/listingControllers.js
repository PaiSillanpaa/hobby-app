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

export const imageTest = (request, response) => {
  const { image } = request.body;

  console.log("image file: ");

  return response.send(image);
};

export const getListingsByTags = async (request, response) => {
  const { tags } = request.body;
  const query = {};

  console.log("tags from controller: ", tags);

  if (tags.length < 1) {
    try {
      const listings = await Listing.find();

      return response.send(listings);
    } catch (error) {
      console.error(error);
      response.status(401).send("Internal server error");
    }
  } else {
    tags.forEach((tag) => {
      const [key, value] = Object.entries(tag)[0];
      query[key] = value;
    });
  }
  try {
    console.log(query);
    const listings = await Listing.find(query);

    return response.send(listings);
  } catch (error) {
    console.error("internal server erro");
    return response.status(400).send("internal server error");
  }
};
