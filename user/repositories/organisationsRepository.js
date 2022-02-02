const db = require('./../db');

const fetch = (sql, par) => {
	return new Promise((resolve, reject) => {
		db.query(sql, par, (error, result) => {
			if (error) return reject(error);
			return resolve(result);
		});
	});
};

async function checkDomainExists(domain) {
	const sql = 'SELECT COUNT(*) as value FROM Organisation WHERE Domain COLLATE UTF8_GENERAL_CI=?';
	const result = await fetch(sql, domain);
	return result[0].value > 0;
}

async function checkDomainExistsAndGetOrganizationInfo(domain) {
	const sql = 'SELECT * FROM Organisation WHERE Domain=?';
	const result = await fetch(sql, domain);
	return result;
}

async function createCompany(companyData) {
	const sql =
		'INSERT INTO ' +
		'Organisation (Name, NumberOfEmployeesID, AnnualRevenueID, ReachID, Domain) ' +
		'VALUES (?,?,?,?,?)';
	const result = await fetch(sql, Object.values(companyData));
	return result;
}

async function getCompanyName(id) {
	const sql = 'SELECT Name FROM Organisation WHERE ID=?;';
	const result = await fetch(sql, id);
	return result;
}

module.exports = {
	checkDomainExists,
	checkDomainExistsAndGetOrganizationInfo,
	createCompany,
	getCompanyName,
};
