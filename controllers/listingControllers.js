import Listing from "../models/listingSchema.js";

export const createListing = async (request, response) => {
  const { newListings } = request.body;
  const user = request.user;

  if (!user) {
    return response.status(401).json("unauthorized");
  }

  console.log("new listings: ", newListings);
  console.log("user: ", user);

  try {
    for (let i = 0; i < newListings.length; i++) {
      console.log(newListings[0]);
      const { title, desc, location, tags } = newListings[i];

      if (!title || !desc) {
        console.log("error creating listing, empty fields!");
        return response.status(400).send("Title and description are required!");
      }

      const newListing = new Listing({
        listingTitle: title,
        listingDesc: desc,
        userId: user.userId,
        location: {
          city: location.city,
          address: location.address,
        },
        tags: tags,
      });

      await newListing.save();
    }
    return response.status(201).send("Listing(s) created succesfully!");
  } catch (error) {
    console.error("Server error from listing creation: ", error.message);
    return response.status(500).send("There was an error creating a listing!");
  }
};

export const getListings = async (request, response) => {
  try {
    const listings = await Listing.find();

    return response.json({ listings: listings });
  } catch (error) {
    console.log(error, "error retrieving listings");
    return response.status(500).send("error retrieving listings!");
  }
};

export const getInactiveListings = async (request, response) => {
  try {
    const listings = await Listing.find({ active: false });

    return response.json({ inactiveListings: listings });
  } catch (error) {
    console.error("error while retrieving inactive listings");
    return response.status(500).send("error retrieving inactive listings");
  }
};

export const getActiveListings = async (request, response) => {
  try {
    const listings = await Listing.find({ active: true });

    return response.json({ activeListings: listings });
  } catch (error) {
    console.error("error while retrieving active listings");
    return response.status(500).send("error retrieving active listings");
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
  console.log(tags.length);

  if (tags.length < 1) {
    try {
      const listings = await Listing.find();

      return response.send(listings);
    } catch (error) {
      console.error(error);
      response.status(401).send("Internal server error");
    }
  }
  try {
    const listings = await Listing.find({ tags: { $in: tags } });
    console.log("Found listings:", listings.length);
    return response.json(listings);
  } catch (error) {
    console.error("internal server error");
    return response.status(400).send("internal server error");
  }
};

export const getCategories = async (request, response) => {
  try {
    const teamListings = await Listing.find({ tags: "team" }).limit(3);
    const adventureListings = await Listing.find({ tags: "adventure" }).limit(
      3
    );
    const randomListings = await Listing.aggregate([
      {
        $match: {
          tags: { $not: { $elemMatch: { $in: ["team", "adventure"] } } },
        },
      },
    ]).limit(3);

    console.log(teamListings);
    console.log(adventureListings);
    console.log(randomListings);

    return response.status(200).json({
      teamListings: teamListings,
      adventureListings: adventureListings,
      randomListings: randomListings,
    });
  } catch (error) {
    console.error("error, when trying to find front page listings: ", error);
    return response.status(400).send("internal server error");
  }
};
