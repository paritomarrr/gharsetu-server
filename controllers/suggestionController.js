import axios from 'axios';

export const suggestPlaces = async (req, res) => {
    try {
        if (!req.body?.query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const { query } = req.body;

        const response = await axios.get(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}&language=en&limit=5&session_token=1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed&country=IN&access_token=pk.eyJ1IjoicGFyaXRvbWFyciIsImEiOiJjbTJ5Zmw1aXYwMDl3MmxzaG91bWRnNXgxIn0.ukF28kdk13Vf2y1EOKQFWg`);

        console.log('response:', response.data);
        
        return res.status(200).json({
            success: true,
            query: query,
            response: response.data
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

export const getCoordinates = async (req, res) => {
    const {query} = req.body;

    const response = await axios.get(`https://api.mapbox.com/search/geocode/v6/forward?q=${query}&access_token=pk.eyJ1IjoicGFyaXRvbWFyciIsImEiOiJjbTJ5Zmw1aXYwMDl3MmxzaG91bWRnNXgxIn0.ukF28kdk13Vf2y1EOKQFWg`)

    const coordinates = response.data.features[0].geometry.coordinates;

    return res.status(200).json({
        success: true,
        coordinates: coordinates
    });

}