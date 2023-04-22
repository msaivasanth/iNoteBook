const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Sample@pass'

const fetchuser = (req, res, next) => {
    const token = req.header('authToken')
    if(!token) {
        res.status(401).json({error: "Invalid authentication"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        res.status(401).json({error: "Invalid authentication"})
    }
}

module.exports = fetchuser;
