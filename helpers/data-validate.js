const { default: mongoose } = require("mongoose");
const { Tag } = require("../models");

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

const excludeTagsNotExists = async(tags = []) => {
    const newTags = [];
    for (const key in tags) {
        const tag = tags[key];
        if (mongoose.isValidObjectId(tag)) {
            const tagDB = await Tag.findById(tag);
            if (tagDB && tagDB.active) {
                newTags.push(tag);
            }
        }
    }
    return newTags;
}

module.exports = {
    emailValidate,
    excludeEmpty,
    excludeTagsNotExists,
    isEmpty
};