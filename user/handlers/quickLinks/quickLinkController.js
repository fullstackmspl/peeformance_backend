const db = require('../../db');

exports.getQuickLinks = (req, res) => {
    let categoriesQuery = "SELECT * FROM QuickLinks"
    db.query(categoriesQuery, function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        return res.json({quickLinks: results});
    });
}