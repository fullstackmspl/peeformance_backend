const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    
    let token = req.headers['authorization'];
    
    if (!token)
        return res.status(401).json({
            error: true,
            message: 'Invalid user.',
        });

	token = token.replace('Bearer ', '');
	jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
		if (err) {
			return res.status(401).json({
				error: true,
				message: 'Invalid user.',
			});
		} else {
            
			req.user = user;
			next();
		}
	});
};

module.exports=verifyToken;