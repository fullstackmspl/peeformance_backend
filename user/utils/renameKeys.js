// rename the keys
function renameKey(obj, oldKey, newKey) {
    obj.forEach((element) => {
        element[newKey] = element[oldKey];
        delete element[oldKey];
    });
}

module.exports = {
    renameKey
}