
exports.createInsert =  (insertData, table) => {
    const columns = Object.keys(insertData);
    const values = Object.values(insertData);

    let sql = "INSERT INTO " + table + " (`" + columns.join("`,`") +"`) VALUES (";

    for (let i = 0; i < values.length; i++) {
        sql += "?";
        if (i !== values.length - 1) {
            sql += ",";
        }
    }

    sql+= ")";
    return {
        sql,
        values
    }
}

exports.count = (condition, table) => {
    const columns = Object.keys(condition);    
    const values = Object.values(condition);  
    let where = " where " + columns.join(" = ? and ") + "= ?"
    let sql ="select count(*) as value from " + table + where;
    return {
        sql,
        values
    }
}

exports.update = (fields, condition, table) => {
    const columns = Object.keys(fields);
    const columnsValues = Object.values(fields); 
    const conditionColumns = Object.keys(condition);
    const conditionValues = Object.values(condition); 
    let where = " where " + conditionColumns.join(" = ? and ") + "= ?"
    let sql = "update " + table + " SET " + columns.join("= ?, ") + "=? " + where;
    return {
        sql,
        values: [...columnsValues, ...conditionValues]
    } 
}