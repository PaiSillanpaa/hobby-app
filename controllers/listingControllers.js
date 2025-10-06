import Listing from "../models/listingSchema.js";
import Favourites from "../models/favouritesSchema.js";
import History from "../models/historySchema.js";
import User from "../models/userSchema.js";

export const createListing = async (request, response) => {
  const { title, description, location, category, age, type, url, company } =
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
      userId: user.userId,
      location: {
        address: parsedLocation.address,
        city: parsedLocation.city,
        coordinates: parsedLocation.coordinates,
      },
      category: parsedCategory,
      age: parsedAge,
      type: type,
      url: url,
      image: base64Image,
      company: company,
    });

    await newListing.save();

    return response
      .status(201)
      .json({ message: "new listing created succesfully!" });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ message: "error when creating a listing" });
  }
};

//---------------------------------------------------------------
//--------------------GET LISTING PATHS--------------------------
//---------------------------------------------------------------

export const getAllListings = async (request, response) => {
  const user = request.user;
  let listings;

  if (!user) {
    return response.status(401).json({ message: "unauthorized" });
  }

  try {
    const currentUser = await User.findById(user.userId);

    if (!currentUser) {
      return response
        .status(403)
        .json({ message: "unauthorized to get all listings" });
    }

    if (currentUser.rank === "admin") {
      listings = await Listing.find().populate("userId", "-password -__v");
    } else if (currentUser.rank === "company") {
      listings = await Listing.find({ userId: currentUser._id }).populate(
        "userId",
        "-password -__v"
      );
    } else {
      return response.status(403).json({ message: "denied" });
    }

    return response.status(200).json({ listings });
  } catch (error) {
    console.log(error, "error retrieving listings");
    return response.status(500).json({ message: "error retrieving listings!" });
  }
};

export const getInactiveListings = async (request, response) => {
  const user = request.user;
  let inactiveListings;

  if (!user) {
    return response.status(401).json({ message: "unauthorized" });
  }

  try {
    const currentUser = await User.findById(user.userId);

    if (!currentUser) {
      return response
        .status(403)
        .json({ message: "Unauthorized to get inactive listing" });
    }

    if (currentUser.rank === "admin") {
      inactiveListings = await Listing.find({ status: "inactive" });
    } else if (currentUser.rank === "company") {
      inactiveListings = await Listing.find({
        userId: currentUser._id,
        status: "inactive",
      });
    } else {
      return response.status(403).json({ message: "denied" });
    }

    return response.status(200).json({ inactiveListings: inactiveListings });
  } catch (error) {
    console.error("error while retrieving inactive listings");
    return response.status(500).send("error retrieving inactive listings");
  }
};

export const getActiveListings = async (request, response) => {
  const user = request.user;
  let activeListings;

  if (!user) {
    return response.status(401).json({ message: "unauthorized" });
  }

  try {
    const currentUser = await User.findById(user.userId);

    if (!currentUser) {
      return response
        .status(403)
        .json({ message: "Unauthorized to get active listing" });
    }

    if (currentUser.rank === "admin") {
      activeListings = await Listing.find({ status: "active" });
    } else if (currentUser.rank === "company") {
      activeListings = await Listing.find({
        userId: currentUser._id,
        status: "active",
      });
    } else {
      return response.status(403).json({ message: "denied" });
    }

    return response.status(200).json({ activeListings });
  } catch (error) {
    console.error("error while retrieving active listings");
    return response.status(500).send("error retrieving active listings");
  }
};

export const getDeletedListings = async (request, response) => {
  const user = request.user;
  let deletedListings;

  if (!user) {
    return response.status(401).json({ message: "unauthorized" });
  }

  try {
    const currentUser = await User.findById(user.userId);

    if (!currentUser) {
      return response
        .status(403)
        .json({ message: "Unauthorized to get deleted listings" });
    }

    if (currentUser.rank === "admin") {
      deletedListings = await Listing.find({ status: "deleted" });
    } else if (currentUser.rank === "company") {
      deletedListings = await Listing.find({
        userId: currentUser._id,
        status: "deleted",
      });
    } else {
      return response.status(403).json({ message: "denied" });
    }

    return response.status(200).json({ deletedListings });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Error when getting deleted listings" });
  }
};

export const getListingsByTags = async (request, response) => {
  const { tags } = request.body;

  console.log("tags from controller: ", tags);
  console.log(tags.length);

  if (tags.length < 1) {
    try {
      const listings = await Listing.find();

      return response.status(200).json({ listings });
    } catch (error) {
      console.error(error);
      response.status(401).send("Internal server error");
    }
  }
  try {
    const listings = await Listing.find({
      $or: [
        { location: { $in: tags } },
        { category: { $in: tags } },
        { age: { $in: tags } },
        { type: { $in: tags } },
      ],
    });

    console.log("Found listings:", listings.length);
    return response.json(listings);
  } catch (error) {
    console.error("internal server error");
    return response.status(400).send("internal server error");
  }
};

export const getCategories = async (request, response) => {
  try {
    const teamListings = await Listing.find({ type: "group" }).limit(3);
    const adventureListings = await Listing.find({
      category: "sport",
    }).limit(3);
    const randomListings = await Listing.aggregate([
      {
        $match: {
          type: { $nin: ["group"] },
          category: { $nin: ["sport"] },
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
  const user = request.user;

  if (!user) {
    return response.status(201).json({ favourites: [] });
  }

  try {
    const favourites = await Favourites.find({ userId: user.userId });

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

export const getHistory = async (request, response) => {
  const user = request.user;

  if (!user) {
    return response.status(401).json({ message: "unauthorized" });
  }

  try {
    const history = await History.find({ userId: user.userid })
      .sort({ creationdate: -1 })
      .populate("listingId");

    return response.status(200).json({ history: history });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "error when retrieving history" });
  }
};

//---------------------------------------------------
//---------------SET LISTING PATHS-------------------
//---------------------------------------------------

export const setFavourite = async (request, response) => {
  const { listingId } = request.body;
  console.log(request.user);
  const user = request.user;

  if (!username || !listingId) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  try {
    const listingToFavourite = await Listing.findOne({ _id: listingId });
    const currentUser = await User.findOne({ _id: user.userId });

    if (!listingToFavourite || !currentUser) {
      return response
        .status(404)
        .json({ message: "could not find user or listing" });
    }

    const existing = await Favourites.findOne({
      userId: currentUser._id,
      listingId: listingToFavourite._id,
    });

    if (existing) {
      return response.status(200).send("Already in favourites");
    }

    const newFavourite = new Favourites({
      userId: currentUser._id,
      listingId: listingToFavourite._id,
    });

    await newFavourite.save();

    return response.status(201).send("added to favourites");
  } catch (error) {
    return response.status(500).send("error when applying favourite");
  }
};

export const addToHistory = async (request, response) => {
  const { listingId } = request.body;
  const user = request.user;

  if (!listingId || !user.userId) {
    return response.status(401).json({ message: "Could not add to history" });
  }

  try {
    const listingToHistory = await Listing.findOne({ _id: listingId });
    const currentUser = await User.findOne({ _id: user.userId });

    if (!listingToHistory || !currentUser) {
      return response
        .status(404)
        .json({ message: "could not find user or listing" });
    }

    const existing = await History.findOne({
      userId: currentUser._id,
      listingId: listingToHistory._id,
    });

    if (existing) {
      existing.creationdate = Date.now();

      await existing.save();
      return response.status(200).send("Updated history");
    }

    const newHistory = new History({
      userId: currentUser._id,
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

//---------------------------------------------------
//---------------UPDATE LISTING PATHS----------------
//---------------------------------------------------

export const updateListing = async (request, response) => {
  const { title, description, city, address } = request.body;

  const listingId = request.params.id;

  const user = request.user;

  if (!listingId) {
    return response.status(400).json({ message: "Listing ID is required" });
  }

  if (!user) {
    return response.status(403).json({ message: "unauthorized" });
  }

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return response.status(404).json({ message: "Listing not found" });
    }

    const currentUser = await User.findById(user.userId);

    if (!currentUser) {
      return response.status(404).json({ message: "User not found" });
    }

    if (currentUser._id !== listing.userId && currentUser.rank !== "admin") {
      return response
        .status(403)
        .json({ message: "Unauthorized to change listing" });
    }

    let shouldSave = false;

    if (title?.trim()) {
      listing.listingTitle = title.trim();
      shouldSave = true;
    }

    if (description?.trim()) {
      listing.listingDescription = description.trim();
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

export const setListingActive = async (request, response) => {
  const { listingId } = request.body;
  const user = request.user;

  if (!listingId) {
    return response.status(400).json({ message: "Listing id is required" });
  }

  if (!user) {
    return response
      .status(401)
      .json({ message: "unauthorized to accept listing" });
  }

  try {
    const currentUser = await User.findById(user.userId);

    if (!currentUser || currentUser.rank !== "admin") {
      return response.status(403).json({ message: "unauthorized" });
    }

    const currentListing = await Listing.findById(listingId);

    if (!currentListing) {
      return response.status(404).json({ message: "Could not find listing" });
    }

    currentListing.status = "active";

    await currentListing.save();

    return response
      .status(200)
      .json({ message: "Listing accepted successfully!" });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "error when accepting listing" });
  }
};

export const setListingDeleted = async (request, response) => {
  const { listingId } = request.body;
  const user = request.user;

  if (!listingId) {
    return response.status(400).json({ message: "Listing id is required" });
  }

  if (!user) {
    return response
      .status(401)
      .json({ message: "unauthorized to set listing deleted" });
  }

  try {
    const currentUser = await User.findById(user.userId);

    if (!currentUser) {
      return response.status(403).json({ message: "unauthorized" });
    }

    const currentListing = await Listing.findById(listingId);

    if (!currentListing) {
      return response.status(404).json({ message: "Could not find listing" });
    }

    if (currentUser.rank === "admin") {
      currentListing.status = "deleted";
    } else if (currentUser.rank === "company") {
      if (currentUser._id !== currentListing.userId) {
        return response
          .status(403)
          .json({ message: "unauthorized to set listing to deleted" });
      }

      currentListing.status = "deleted";
    } else {
      return response
        .status(403)
        .json({ message: "unathorized to change listing's status" });
    }

    await currentListing.save();
    return response
      .status(200)
      .json({ message: "listing status set to deleted succesfully" });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "error when setting listing to deleted" });
  }
};

export const setListingInactive = async (request, response) => {
  const { listingId } = request.body;
  const user = request.user;

  if (!listingId) {
    return response.status(400).json({ message: "Listing id is required" });
  }

  if (!user) {
    return response
      .status(401)
      .json({ message: "unauthorized to set listing inactive" });
  }

  try {
    const currentUser = await User.findById(user.userId);

    if (!currentUser) {
      return response.status(403).json({ message: "unauthorized" });
    }

    const currentListing = await Listing.findById(listingId);

    if (!currentListing) {
      return response.status(404).json({ message: "Could not find listing" });
    }

    if (
      currentUser._id !== currentListing.userId &&
      currentUser.rank !== "admin"
    ) {
      return response
        .status(403)
        .json({ message: "Unauthorized to change listing" });
    }

    currentListing.status = "inactive";

    await currentListing.save();
    return response
      .status(200)
      .json({ message: "listing status set to inactive succesfully" });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "error when setting listing to inactive" });
  }
};

//----------------------------------------------------
//------------- DELETE LISTING PATHS -----------------
//----------------------------------------------------

export const deleteListing = async (request, response) => {
  const listingId = request.params.id;

  const user = request.user;

  if (!listingId) {
    return response.status(400).json({ message: "Listing id is required" });
  }

  if (!user) {
    return response
      .status(401)
      .json({ message: "unauthorized to decline listing" });
  }

  try {
    const currentUser = await User.findById(user.userId);

    if (!currentUser) {
      return response.status(403).json({ message: "unauthorized" });
    }

    const currentListing = await Listing.findById(listingId);

    if (!currentListing) {
      return response.status(404).json({ message: "Could not find listing" });
    }

    if (
      currentUser._id !== currentListing.userId &&
      currentUser.rank !== "admin"
    ) {
      return response
        .status(403)
        .json({ message: "Unauthorized to change listing" });
    }

    await Listing.findByIdAndDelete(currentListing._id);

    return response
      .status(200)
      .json({ message: "Listing deleted successfully!" });
  } catch (error) {
    return response.status(500).send("Error when deleting listing");
  }
};
