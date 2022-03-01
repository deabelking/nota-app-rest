const { response, request } = require("express");
const { Tag } = require("../models");


const getTag = async(req = request, res = response) => {
    const { id } = req.params;
    const tag = await Tag.findById(id);
    res.json(tag);
}

const getTags = async(req = request, res = response) => {
    const { start = 0, end = 5 } = req.query;
    const query = { active: true };
    const [total, tags] = await Promise.all(
        [
            Tag.countDocuments(query),
            Tag.find(query).skip(start).limit(end)
        ]
    );
    res.json({ total, tags });

}

const createTag = async(req = request, res = response) => {
    const { name } = req.body;
    const data = { name };
    const tag = new Tag(data);
    await tag.save();
    res.status(201).json(tag);
}

const updateTag = async(req = request, res = response) => {
    const { id } = req.params;
    const { name } = req.body;
    const data = { name };
    const tag = await Tag.findByIdAndUpdate(id, data, { new: true });
    res.json(tag);
}

const deleteTag = async(req = request, res = response) => {
    const { id } = req.params;
    const tag = await Tag.findByIdAndUpdate(id, { active: false }, { new: true });
    res.json(tag);
}

module.exports = {
    createTag,
    deleteTag,
    getTags,
    getTag,
    updateTag
}