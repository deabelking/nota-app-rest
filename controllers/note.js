const { response, request } = require("express");
const { Note } = require("../models");

const getNotes = async(req = request, res = response) => {
    const { start = 0, end = 5 } = req.query;
    const queryOr = [{ public: true }];
    const queryAnd = [{ active: true }];
    const user = req.user;
    if (user) {
        queryOr.push({ user: user.id });
    }
    const query = { $or: queryOr, $and: queryAnd };
    const [total, notes] = await Promise.all(
        [
            Note.countDocuments(query),
            Note.find(query)
            .populate('user', 'name')
            .skip(Number(start))
            .limit(Number(end))
        ]
    );
    res.json({ total, notes });
}

const getNote = async(req = request, res = response) => {
    const { id } = req.params;
    const note = await Note.findById(id)
        .populate('user', 'name');
    const user = req.user;
    if (note.public) {
        return res.json(note);
    } else {
        if (user && user.id === note.user) {
            return res.json(note);
        } else {
            return res
                .status(401)
                .json({ msg: "La nota es privada" });
        }
    }
}


const createNote = async(req = request, res = response) => {
    const { name, content, public = false } = req.body;
    const data = { name, content, public };
    data.user = req.user.id;
    const note = new Note(data);
    await note.save();
    res.status(201).json(note);
}

module.exports = {
    createNote,
    getNote,
    getNotes
}