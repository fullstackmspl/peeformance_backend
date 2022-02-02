const db = require('../../db');

exports.paymentHistory = (req, res) => {
	const userid = req.query.userid;
	const sorting_field = req.query.sortingfield;
	const sorting_order = req.query.sortingorder;
	const search_field = req.query.searchfield;
	const search_value = req.query.searchvalue;

	const categoriesQuery = '{insert sql command here}'; // build your query here

	db.query(categoriesQuery, function (error, results, fields) {
		if (error) {
			console.log(error); // TODO: add error handling
		}

		// pass the returned results here
		return res.json({ paymentHistory: results });
	});
};
