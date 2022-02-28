const isEmpty = (fields = {}) => {
    for (let key in fields) {
        if (fields[key] === '') {
            return false;
        }
    }
    return true;
}

const excludeEmpty = (fields = {}) => {
    const data = {};
    for (let key in fields) {
        if (fields[key] !== '') {
            data[key] = fields[key];
        }
    }
    return data;
}

const emailValidate = (email) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/.test(email)) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    emailValidate,
    excludeEmpty,
    isEmpty
};