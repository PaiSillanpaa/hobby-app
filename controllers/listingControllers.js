import Listing from "../models/listingSchema.js";
import Favourites from "../models/favouritesSchema.js";
import History from "../models/historySchema.js";
import User from "../models/userSchema.js";

export const createListing = async (request, response) => {
  const { title, description, location, category, age, type, url } =
    request.body;
  const image = request.file;
  const user = request.user;

  if (!user) {
    return response.status(401).json("unauthorized");
  }

  if (!title || !description) {
    console.log("error creating listing, empty fields!");
    return response.status(400).send("Title and description are required!");
  }

  console.log("user: ", user);

  try {
    const parsedLocation = JSON.parse(location);
    const parsedCategory = JSON.parse(category);
    const parsedAge = JSON.parse(age);

    const base64Image = image ? image.buffer.toString("base64") : null;

    const newListing = new Listing({
      listingTitle: title,
      listingDescription: description,
      userId: user._id,
      location: {
        address: parsedLocation.address,
        city: parsedLocation.city,
        coordinates: parsedLocation.coords,
      },
      category: parsedCategory,
      age: parsedAge,
      type: type,
      url: url,
      image: base64Image,
    });

    await newListing.save();

    return response
      .status(201)
      .json({ message: "new listing created succesfully!" });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "error when creating a listing" });
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
    const listings = await Listing.find({ active: "active" });

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

export const addToHistory = async (request, response) => {
  const { listingId } = request.body;
  const user = request.user;

  if (!listingId || !user._id) {
    return response.status(401).json({ message: "Could not add to history" });
  }

  try {
    const listingToHistory = await Listing.findOne({ _id: listingId });
    const currentUser = await User.findOne({ username: user.username });

    if (!listingToHistory || !currentUser) {
      return response
        .status(404)
        .json({ message: "could not find user or listing" });
    }

    const existing = await History.findOne({
      userId: user._id,
      listingId: listingToHistory._id,
    });

    if (existing) {
      existing.creationdate = Date.now();

      await existing.save();
      return response.status(200).send("Updated history");
    }

    const newHistory = new History({
      userId: user._id,
      listingId: listingToHistory._id,
    });

    await newHistory.save();
    return response.status(201).send("Added to history");
  } catch (error) {
    return response
      .status(500)
      .json({ message: "error when adding to history" });
  }
};

export const getHistory = async (request, response) => {
  const user = request.user;

  if (!user) {
    return response.status(401).json({ message: "unauthorized" });
  }

  try {
    const history = await History.find({ userId: user._id })
      .sort({ creationdate: -1 })
      .populate("listingId");

    return response.status(200).json({ history: history });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "error when retrieving history" });
  }
};

export const deleteListing = async (request, response) => {
  const { listingId } = request.body;
  const user = request.user;

  if (!listingId || !user) {
    return response
      .status(401)
      .json({ message: "unauthorized to delete listing" });
  }

  try {
    const currentUser = await User.findOne({ _id: user.id });

    if (!currentUser) {
      return response.status(401).json({ message: "User not found" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return response.status(404).json({ message: "Listing not found" });
    }

    const isOwner = listing.userId.toString() === user.id;
    const isAdmin = currentUser.rank === "admin";

    if (!isOwner && !isAdmin) {
      return response
        .status(403)
        .json({ message: "Forbidden: not allowed to delete this listing" });
    }

    await Listing.deleteOne({ _id: listingId });
    return response
      .status(200)
      .json({ message: "listing deleted successfully!" });
  } catch (error) {
    return response.status(500).json({ message: "error deleting listing!" });
  }
};

export const updateListing = async (request, response) => {
  const { title, description, city, address, listingId } = request.body;

  if (!listingId) {
    return response.status(400).json({ message: "Listing ID is required" });
  }

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return response.status(404).json({ message: "Listing not found" });
    }

    let shouldSave = false;

    if (title?.trim()) {
      listing.title = title.trim();
      shouldSave = true;
    }

    if (description?.trim()) {
      listing.description = description.trim();
      shouldSave = true;
    }

    if (city?.trim()) {
      listing.location.city = city.trim();
      shouldSave = true;
    }

    if (address?.trim()) {
      listing.location.address = address.trim();
      shouldSave = true;
    }

    if (shouldSave) {
      await listing.save();
      return response
        .status(200)
        .json({ message: "Listing updated successfully" });
    }

    return response.status(400).json({ message: "No valid fields to update" });
  } catch (error) {
    return response.status(500).json({ message: "error updating listing" });
  }
};
