import Property from '../models/propertyModel.js';
import User from "../models/userModel.js";


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
      description
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
      images,
      description
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

  console.log({
    locality,
    city,
    mode
  })

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