const sendErrorResponse = require('../middlewares/response').sendErrorResponse;
const sendItemResponse = require('../middlewares/response').sendItemResponse;

const version = (req, res) => {
    try {
        return sendItemResponse(req, res, {
            helm: process.env.npm_package_version,
        });
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
};

module.exports = version;
