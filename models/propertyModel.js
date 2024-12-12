import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        verified: {
            type: Boolean,
            required: true,
            default: false,
        },
        description:{
            type: String,
            required: true,
        },
        listedBy: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        propertyType: {
            type: String,
            required: true,
        },
        firmName: {
            type: String,
        },
        propertySubType: {
            type: String,
        },
        availableFor: {
            type: String,
        },
        project: {
            type: String,
        },
        area: {
            type: String,
        },
        address: {
            houseNumber: {
                type: String,
                required: true
            },
            buildingProjectSociety: {
                type: String
            },
            state: {
                type: String,
                required: true
            },
            pincode: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            locality: {
                type: String,
                required: true
            },
        },
        plotSize: {
            plotLength: {
                type: Number,
                required: true
            },
            plotWidth: {
                type: Number,
                required: true
            },
            plotArea: {
                type: Number,
                required: true
            },
        },
        furnishType: {
            type: String
        },
        flatFurnishings: {
            type: [String]
        },
        societyAmenities: {
            type: [String]
        },
        askedPrice: {
            type: Number,
            required: true
        },
        propertyStatus: {
            type: String,
            required: true
        },
        coordinates: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            },
        },
        images: { type: Array }, 
        impressions: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        generatedLeads: { type: Number, default: 0 },
      
    },
    { timestamps: true }
);

propertySchema.index({ 
    "address.locality": 1, 
    "address.city": 1, 
    "address.state": 1 
});

const Property = mongoose.model("PropertyV2", propertySchema);

export default Property;
