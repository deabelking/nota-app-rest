const { response, request } = require("express");
const { isValidObjectId, Types } = require('mongoose');
const { excludeTagsNotExists, excludeEmpty } = require("../helpers/data-validate");
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
            .populate('tags', 'name')
            .skip(Number(start))
            .limit(Number(end))
        ]
    );
    res.json({ total, notes });
}

const getNote = async(req = request, res = response) => {
    const { id } = req.params;
    const note = await Note.findById(id)
        .populate('user', 'name')
        .populate('tags', 'name');
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
    const { name, content, public = false, tags } = req.body;
    const tagsValid = await excludeTagsNotExists(tags);
    const data = { name, content, public, tags: tagsValid };
    data.user = req.user.id;
    const note = new Note(data);
    await note.save();
    res.status(201).json(note);
}

const updateNote = async(req = request, res = response) => {
    const { id } = req.params;
    const { name = '', content = '', public = '', tags = '' } = req.body;
    const data = excludeEmpty({ name, content, public, tags });
    if (data.tags) {
        data.tags = await excludeTagsNotExists(tags);
    }
    const note = await Note.findByIdAndUpdate(id, data, { new: true });
    res.json(note);
}


const searchNote = async(req = request, res = response) => {
    const { field, value } = req.params;
    const { start = 0, end = 5 } = req.query;
    const { user: currentUser } = req;
    const queryAnd = [];
    const queryOr = [];
    let query;
    switch (field) {
        case 'user':
            if (isValidObjectId(value)) {
                const _id = Types.ObjectId(value);
                /**Usuario peticion igual a usuario logiado? */
                if (currentUser && _id.equals(currentUser._id)) { /*puede mostrar publicas y privadas*/
                    queryAnd.push(...[{ active: true }, { user: _id }]);
                } else { //mostrar solo publicas
                    queryAnd.push(...[{ active: true }, { public: true }, { user: _id }]);
                }
                query = { $and: queryAnd };
            } else {
                return res.status(400).json({ msg: 'usuario desconocido' });
            }
            break;
        case 'tag':
            if (isValidObjectId(value)) {
                const _id = Types.ObjectId(value);
                /**Usuario peticion igual a usuario logiado? */
                queryOr.push({ public: true });
                queryAnd.push(...[{ active: true }, { tags: _id }]);
                if (currentUser) {
                    queryOr.push({ user: currentUser._id })
                }
                query = { $and: queryAnd, $or: queryOr };
            } else {
                return res.status(400).json({ msg: 'tag desconocido' });
            }
            break;
        case 'name':
        case 'content':
            queryAnd.push(...[{ active: true }, { $text: { $search: value } }]);
            queryOr.push({ public: true });
            if (currentUser) {
                queryOr.push({ user: currentUser._id })
            }
            query = { $or: queryOr, $and: queryAnd };
            break;
        default:
            return res.status(400).json({ msg: 'Busqueda no definida' });
    }
    const [total, notes] = await Promise.all(
        [
            Note.countDocuments(query),
            Note.find(query)
            .skip(Number(start))
            .limit(Number(end))
            .populate('user', 'name')
            .populate('tags', 'name')
        ]
    )
    return res.json({ total, notes });

}
module.exports = {
    createNote,
    getNote,
    getNotes,
    updateNote,
    searchNote
}