// Allow CORS
module.exports = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_URL);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
};