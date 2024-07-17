const Place = require('../models/place'); // Assuming the correct model is 'place'

const place_search_get = (req, res) => {
    res.render('access/posts/search', { title: 'Search', query: '', places: [] });
}

const place_search_post = async (req, res) => {
    try {
        const query = req.body.query;
        console.log('Search Query:', query);

        // Assuming Place is a mongoose model and has a method to search places
        const places = await Place.find({ name: new RegExp(query, 'i') });

        console.log('Search Results:', places);

        if (places.length === 0) {
            console.log('No results found for the query:', query);
        }

        res.render('access/posts/search', {
            title: 'Search Results',
            places: places,
            query: query
        });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    place_search_get,
    place_search_post
}
