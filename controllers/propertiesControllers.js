import Property from '../models/propertyModel.js';
import User from "../models/userModel.js";
import mongoose from 'mongoose';

export const propertiesTest = (req, res) => {
  res.json({
    message: 'Properties controller works'
  })
}

export const createProperty = async (req, res) => {
  try {
    const {
      ownerId,
      listedBy,
      firstName,
      lastName,
      phoneNumber,
      email,
      propertyType,
      firmName,
      propertySubType,
      availableFor,
      project,
      area,
      address,
      plotSize,
      furnishType,
      flatFurnishings,
      societyAmenities,
      askedPrice,
      propertyStatus,
      coordinates,
      images,
      description,
      bhkConfig
    } = req.body;

    console.log('oD', ownerId)

    const newProperty = new Property({
      ownerId,
      listedBy,
      firstName,
      lastName,
      phoneNumber,
      email,
      propertyType,
      firmName,
      propertySubType,
      availableFor,
      project,
      area,
      address,
      plotSize,
      furnishType,
      flatFurnishings,
      societyAmenities,
      askedPrice,
      propertyStatus,
      coordinates,
      location: {
        type: "Point",
        coordinates: [coordinates.longitude, coordinates.latitude]
      },
      images,
      description,
      bhkConfig
    });

    console.log('description', description)

    const savedProperty = await newProperty.save();

    // Respond with the created property
    return res.status(201).json({
      success: true,
      message: "Property created successfully",
    });
  } catch (error) {
    console.error("Error creating property:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create property",
      error: error.message
    });
  }
};

export const getAllProperties = async (req, res) => {
  const { mode } = req.body;

  const properties = await Property.find({ availableFor: mode === 'rent' ? 'Rent' : 'Sell' });

  return res.json({
    message: 'Get all properties',
    success: true,
    properties
  })
}

export const getSingleProperty = async (req, res) => {
  const { propertyId } = req.body;

  const property = await Property.findById(propertyId);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: "Property not found"
    })
  }

  await Property.updateOne({
    _id: propertyId
  }, {
    $inc: { views: 1 }
  })

  return res.json({
    success: true,
    property
  })
}

export const getRecentProperties = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const limit = Math.min(4, totalProperties);

    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const propertyIds = properties.map(p => p._id);
    if (propertyIds.length > 0) {
      await Property.updateMany(
        {
          _id: {
            $in: propertyIds
          }
        },
        {
          $inc: {
            impressions: 1
          }
        }
      )
    }

    return res.json({
      success: true,
      properties,
      total: totalProperties
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching recent properties",
      error: error.message
    });
  }
}

export const deleteProperty = async (req, res) => {
  const { propertyId, userId } = req.body;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Convert both IDs to strings for comparison
    const ownerIdString = property.ownerId.toString();
    const userIdString = userId.toString();

    if (ownerIdString !== userIdString) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Using deleteOne() instead of remove() as remove() is deprecated
    await Property.deleteOne({ _id: propertyId });

    return res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
};

export const sellerProfile = async (req, res) => {
  const { propertyId } = req.body;

  const property = await Property.findById(propertyId);


  const user = await User.findById(property?.ownerId);

  return res.json({
    success: true,
    ownerData: {
      firstName: user?.firstName,
      lastName: user?.lastName,
    }
  })
}

export const searchPlaces = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(400).json({
        message: 'Search query is required',
        success: false
      });
    }

    const searchRegex = new RegExp(searchQuery, 'i');

    const locations = await Property.aggregate([
      {
        $match: {
          $or: [
            { "address.locality": searchRegex },
            { "address.city": searchRegex },
            { "address.state": searchRegex }
          ]
        }
      },
      {
        $group: {
          _id: {
            city: "$address.city",
            state: "$address.state"
          },
          localities: { $addToSet: "$address.locality" }
        }
      },
      {
        $project: {
          _id: 0,
          city: "$_id.city",
          state: "$_id.state",
          localities: 1
        }
      },
      {
        $limit: 10
      }
    ]);

    return res.json({
      message: 'Locations found',
      success: true,
      count: locations.length,
      locations
    });

  } catch (error) {
    console.error('Search Error:', error);
    return res.status(500).json({
      message: 'Error searching locations',
      success: false,
      error: error.message
    });
  }
};

export const filteredProperties = async (req, res) => {
  const { locality, city, mode } = req.body;

  const formatLocality = (locality) => {
    let formatted = locality.replace(/(\d+)/g, ' $1');
    formatted = formatted.replace(/([a-z])([A-Z])/g, '$1 $2');
    formatted = formatted.trim();
    return formatted;
  };

  console.log('formatted', formatLocality(locality));

  try {

    const properties = await Property.find({
      $and: [
        { "address.locality": formatLocality(locality) },
        { "address.city": city },
        { "availableFor": mode === 'rent' ? 'Rent' : 'Sell' }
      ]
    });

    return res.json({
      message: 'Properties found',
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching properties',
      success: false,
      error: error.message
    })
  }
};

export const contactOwner = async (req, res) => {
  const { propertyId } = req.body;
  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    })
  }

  await Property.updateOne({
    _id: propertyId
  },
    {
      $inc: {
        generatedLeads: 1
      }
    }
  )

  //TODO : Logic for sending message/notidication to the owner. 

  return res.json({
    success: true,
    message: "owner contacted."
  })
}

export const getAllPropertiesInCity = async (req, res) => {
  const { city } = req.body;
  console.log('city', city);

  try {
    // Fetch only the required fields and limit the response to 8 properties
    const properties = await Property
      .find({ "address.city": city })
      .select("title askedPrice address images") // Add required fields here
      .limit(8);

    return res.json({
      message: 'Get all properties in city',
      success: true,
      properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({
      message: 'Failed to fetch properties',
      success: false,
      error: error.message
    });
  }
};

export const getPropertyReviews = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findById(propertyId).populate('reviews.userId', 'firstName lastName');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    return res.json({
      success: true,
      reviews: property.reviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message
    });
  }
};

export const submitPropertyReview = async (req, res) => {
  const { propertyId } = req.params;
  const { userId, review, rating } = req.body;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    const newReview = {
      userId,
      review,
      rating
    };

    property.reviews.push(newReview);
    await property.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: newReview
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message
    });
  }
};

export const deletePropertyReview = async (req, res) => {
  const { propertyId, reviewId } = req.params;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const reviewIndex = property.reviews.findIndex(
      (review) => review._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    property.reviews.splice(reviewIndex, 1);
    await property.save();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

export const updateProperty = async (req, res) => {
  const { propertyId } = req.params;
  const {
    ownerId,
    listedBy,
    firstName,
    lastName,
    phoneNumber,
    email,
    propertyType,
    firmName,
    propertySubType,
    availableFor,
    project,
    area,
    address,
    plotSize,
    furnishType,
    flatFurnishings,
    societyAmenities,
    askedPrice,
    propertyStatus,
    coordinates,
    images,
    description,
    bhkConfig
  } = req.body;

  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      {
        ownerId,
        listedBy,
        firstName,
        lastName,
        phoneNumber,
        email,
        propertyType,
        firmName,
        propertySubType,
        availableFor,
        project,
        area,
        address,
        plotSize,
        furnishType,
        flatFurnishings,
        societyAmenities,
        askedPrice,
        propertyStatus,
        coordinates,
        images,
        description,
        bhkConfig
      },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update property",
      error: error.message,
    });
  }
};

const isPointInsidePolygon = (point, polygon) => {
  let inside = false;
  const x = point[0], y = point[1];

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];

      const intersect = ((yi > y) !== (yj > y)) &&
          (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      
      if (intersect) inside = !inside;
  }

  return inside;
};


export const filterPropertiesByShape = async (req, res) => {
  try {
      const { shape, mode } = req.body;

      if (!shape || !shape.geometry || !shape.geometry.coordinates) {
          console.error("Invalid shape data received:", JSON.stringify(shape, null, 2));
          return res.status(400).json({ success: false, message: "Invalid shape data" });
      }

      const coordinates = shape.geometry.coordinates[0].map(coord => [coord[0], coord[1]]);
      console.log("Received shape coordinates:", JSON.stringify(coordinates, null, 2));

      const properties = await Property.find({
          "coordinates.longitude": { $exists: true }, 
          "coordinates.latitude": { $exists: true },
          "availableFor": mode === 'rent' ? 'Rent' : 'Sell'
      }).lean();

      console.log("Fetched properties:", properties.length);

      const filteredProperties = properties.filter(property => {
          if (!property.coordinates || !property.coordinates.longitude || !property.coordinates.latitude) {
              console.error("Missing coordinates in property:", property);
              return false;
          }

          const propCoords = [property.coordinates.longitude, property.coordinates.latitude];
          return isPointInsidePolygon(propCoords, coordinates);
      });

      console.log("Filtered properties count:", filteredProperties.length);

      return res.json({ success: true, properties: filteredProperties });
  } catch (error) {
      console.error("Error filtering properties by shape:", error);
      return res.status(500).json({ success: false, message: "Failed to filter properties by shape", error: error.message });
  }
};

export const getNearbyProperties = async (req, res) => {
  const { coordinates, propertyId } = req.body;
  console.log("Received coordinates:", coordinates);
  try {
    const properties = await Property.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [coordinates.longitude, coordinates.latitude]
          },
          $maxDistance: 1000000
        }
      },
      _id: { $ne: propertyId } // Exclude the current property
    });
    console.log("Found nearby properties:", properties);
    if (properties.length === 0) {
      console.log("No properties found within the specified radius.");
    }
    res.status(200).json({
      success: true,
      properties
    });
  } catch (error) {
    console.error("Error fetching nearby properties:", error);
    res.status(500).json({ message: error.message });
  }
};