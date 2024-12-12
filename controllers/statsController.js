import Property from "../models/propertyModel.js";

export const getDashboardStats = async (req, res) => {
    const {userId} = req.body;
    
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    try {
        // filter properties by ownerId to count how many this user owns
        const totalListings = await Property.countDocuments({
            ownerId: userId
        });

        // if no properties are found for this user, return zeroes
        if (totalListings === 0) {
            return res.json({
                success: true,
                data: {
                    totalListings: 0,
                    totalImpressions: 0,
                    totalViews: 0,
                    totalGenerated: 0
                }
            });
        }

        // aggregate user-specific impressions, view, generatedLeads
        const impressionResult = await Property.aggregate([
            {$match: { ownerId: userId}},
            {$group: {_id: null, total: {$sum: "$impressions"}}}
        ]);

        const totalImpressions = impressionResult.length > 0 ? impressionResult[0].total : 0;

        const viewsResult = await Property.aggregate([
            { $match: { ownerId: userId } },
      { $group: { _id: null, total: { $sum: "$views" } } }
        ])
        const totalViews = viewsResult.length > 0 ? viewsResult[0].total : 0;

        const generatedResult = await Property.aggregate([
          { $match: { ownerId: userId } },
          { $group: { _id: null, total: { $sum: "$generatedLeads" } } }
        ]);
        const totalGenerated = generatedResult.length > 0 ? generatedResult[0].total : 0;

        return res.json({
            success: true,
            data: {
                totalListings,
                totalImpressions,
                totalViews,
                totalGenerated
            }
        })

    }
    catch (error) {
        console.error('Error fetching user-specific stats: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}