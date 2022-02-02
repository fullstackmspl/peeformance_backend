const db = require('../../db');
const fs = require('fs');


exports.getCategory = (req, res) => {
    const categoriesQuery = "SELECT * FROM Categories ORDER BY 'SIC'";

    db.query(categoriesQuery, function (error, results, fields) {
        if (error) {
            console.log(error); // TODO: add error handling
        }
        fs.writeFile('categories.json', JSON.stringify(results), function (err) {
            if (err) {
                console.log(err);
            }
        });
        return res.json({categories: results});
    });
};
