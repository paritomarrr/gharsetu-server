import axios from 'axios';

export const suggestPlaces = async (req, res) => {
    try {
        if (!req.body?.query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const { query } = req.body;
        const response = await axios.get(
            'https://api.mapbox.com/search/geocode/v6/forward', {
                params: {
                    q: encodeURIComponent(query),
                    access_token: 'pk.eyJ1IjoicGFyaXRvbWFyciIsImEiOiJjbTJ5Zmw1aXYwMDl3MmxzaG91bWRnNXgxIn0.ukF28kdk13Vf2y1EOKQFWg',
                }
            }
        );

        const suggestions = response.data.features
            .filter(feature => feature.properties.feature_type === 'locality')
            .map(feature => ({
                id: feature.id,
                name: feature.properties.name,
                full_address: feature.properties.full_address,
                coordinates: {
                    longitude: feature.properties.coordinates.longitude,
                    latitude: feature.properties.coordinates.latitude
                },
                city: feature.properties.context?.place?.name || feature.properties.name, // Added city
                country: feature.properties.context?.country?.name || null,
                region: feature.properties.context?.region?.name || null,
            }));

        return res.status(200).json({
            success: true,
            data: suggestions
        });

    } catch (error) {
        console.error('Error in suggestPlaces:', error);
        
        if (error.response?.status === 401) {
            return res.status(401).json({ error: 'Invalid Mapbox access token' });
        }

        return res.status(500).json({
            error: 'Failed to fetch place suggestions',
            message: error.message
        });
    }
};