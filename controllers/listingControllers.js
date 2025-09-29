import Listing from "../models/listingSchema.js";
import Favourites from "../models/favouritesSchema.js";
import History from "../models/historySchema.js";
import User from "../models/userSchema.js";

export const createListing = async (request, response) => {
  const { newListings } = request.body;
  const { newImages } = request.files;
  const user = request.user;

  if (!user) {
    return response.status(401).json("unauthorized");
  }

  console.log("new listings: ", newListings);
  console.log("user: ", user);

  try {
    for (let i = 0; i < newListings.length; i++) {
      console.log(newListings[i]);
      const { title, description, location, category, age, type, url } =
        newListings[i];

      const image = newImages[i];

      if (!title || !description) {
        console.log("error creating listing, empty fields!");
        return response.status(400).send("Title and description are required!");
      }

      const newListing = new Listing({
        listingTitle: title,
        listingDescription: description,
        userId: user._id,
        location: {
          city: location.city,
          address: location.address,
          coordinates: location.coords,
        },
        category: category,
        age: age,
        type: type,
        url: url,
        image: image,
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

export const getFavourites = async (request, response) => {
  const { username, _id } = request.user;

  if (!username) {
    return response.status(201).json({ favourites: [] });
  }

  try {
    const favourites = await Favourites.find({ userId: _id });

    if (!favourites) {
      return response.status(204).send({ favourites: [] });
    }

    return response.status(200).send({ favourites: favourites });
  } catch (error) {
    return response
      .status(500)
      .send({ message: "error when retrieving favourites" });
  }
};

export const setFavourite = async (request, response) => {
  const { listingId } = request.body;
  console.log(request.user);
  const { username } = request.user;

  if (!username || !listingId) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  try {
    const listingToFavourite = await Listing.findOne({ _id: listingId });
    const user = await User.findOne({ username: username });

    if (!listingToFavourite || !user) {
      return response
        .status(404)
        .json({ message: "could not find user or listing" });
    }

    const existing = await Favourites.findOne({
      userId: user._id,
      listingId: listingToFavourite._id,
    });

    if (existing) {
      return response.status(200).send("Already in favourites");
    }

    const newFavourite = new Favourites({
      userId: user._id,
      listingId: listingToFavourite._id,
    });

    await newFavourite.save();

    return response.status(201).send("added to favourites");
  } catch (error) {
    return response.status(500).send("error when applying favourite");
  }
};

export const getListingsByUser = async (request, response) => {
  const { username, _id } = request.user;

  if (!_id) {
    return response.status(401).send({ message: "Unauthorized" });
  }

  try {
    const userListings = await Listing.find({ userId: _id });
    return response.status(200).send({ userListings: userListings });
  } catch (error) {
    return response
      .status(500)
      .send({ message: "Error retrieving user listings" });
  }
};
