const advancedResults = (model, populate) => async (req, res, next) => {
    // Initialize Query
    let query;

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const fieldsToRemove = ['select', 'sort', 'page', 'limit']

    // Loop over and remove from reqQuery
    fieldsToRemove.forEach((param) => {
        delete reqQuery[param];
    });
    // console.log(reqQuery);

    // Create custom query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => '$' + match)
    // console.log(queryStr)

    query = model.find(JSON.parse(queryStr))

   // Select fields
    if (req.query.select) {
        const fields = req.query.select.split('.').join(' ');
        query = query.select(fields)
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ")
        query = query.sort(sortBy)
    } else {
        query = query.sort('createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit - 1
    const total = await model.countDocuments(JSON.parse(queryStr))

    query = query.skip(startIndex).limit(limit)

    // populate
    if(populate) {
        query = query.populate(populate)
    }
    
    // Execute Query
    const results = await query;

    // Pagination Results
    const pagination = {}

    // No last page check

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        }
    }

    // Page one check
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next()

}

module.exports = advancedResults;