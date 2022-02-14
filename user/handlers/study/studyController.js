const db = require('../../db');
const moment = require('moment');

exports.submitStudy = (req, res) => {
	const studyData = req.body.studyData;

	// register user
	const submittedData = 'INSERT INTO tempstudydata (submittedData) VALUES (?)';
	db.query(submittedData, [studyData], (error, results) => {
		if (error) {
			console.log('An error occurred ->', error);
			return res.status(409).json({
				error: true,
				message: 'Data insertion was unsuccessful',
			});
		} else {
			console.log('Data inserted successfully');
			return res.json({ status: 'success', serverStatus: results });
		}
	});
};

exports.getStudy = (req, res) => {
	// register user
	const getData = 'SELECT * FROM tempstudydata LIMIT 1';

	db.query(getData, (error, data, results) => {
		if (error) {
			return res.status(409).json({
				error: true,
				message: 'Email already exists',
			});
		} else {
			let submittedData = data[0].submittedData;
			return res.json({ status: 'success', studyData: submittedData });
		}
	});
};

exports.studyGroups = (req, res) => {
	const timeFormat = 'YYYY-MM-DDTHH:mm:ss';
	let clientTime = req.query.time;

	const categoriesJSONQuery = 'SELECT * FROM settings ORDER BY ID DESC LIMIT 1;';

	db.query(categoriesJSONQuery, (error, data) => {
		if (error) {
			return res.status(409).json({
				error: true,
				message: 'Email already exists',
			});
		} else {
			let parseDataStage1 = data[0];
			let parseDataStage2 = JSON.parse(parseDataStage1.JSONObject); // JSONObject is the column name
			let serverTime = parseDataStage1.CategoryTimestamp; // JSONObject is the column name

			clientTime = moment(clientTime).format(timeFormat);
			serverTime = moment(serverTime).format(timeFormat);

			if (clientTime === serverTime) {
				return res.json({ status: 'upToDate' });
			} else {
				return res.json({
					status: 'new',
					time: parseDataStage1.CategoryTimestamp,
					categories: parseDataStage2,
				});
			}
		}
	});
};
