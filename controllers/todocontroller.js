"use strict"

const { Todo } = require("../models/index.js")
const jwt = require("jsonwebtoken")

class TodoController {
    static async post (req,res,next) {
        let form = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            due_date: new Date(req.body.due_date),
            userId:req.access_id
        }
        try {
            const result = await Todo.create(form)
            res.status(201).json(result.dataValues)
        } catch (err) {
            next(err)
        }
    }
    static async get (req,res,next) {
        try {
            const list = await Todo.findAll({where:{userId:req.access_id}})
            res.status(200).json(list)
        } catch(err) {
            
            next(err)
        }
    }
    static async getSpecific (req,res,next) {
        console.log("passes getSpecific")
        try {
            const result = await Todo.findOne({where:{id:req.params.id}})
            if (!result) throw new Error("File not Found")
            res.status(200).json(result)
        } catch(err) {
            next(err)
        }
    }
    static async putSpecific (req,res,next) {
        let form = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        }
        if (req.body.due_date) form.due_date = new Date(req.body.due_date)
        try {
            const result = await Todo.update(form,{where:{id:req.params.id},returning:true})
            if (!result[0]) throw new Error("File not Found")
            res.status(200).json(result[1][0])
        } catch(err) {
            next(err)
        }
    }
    static async delSpecific (req,res,next) {
        try {
            const returning = await Todo.findOne({where:{id:req.params.id}})
            if (!returning) throw new Error("File not Found")
            const destroyed = await Todo.destroy({where:{id:req.params.id}})
            res.status(200).json(returning)
        } catch(err) {
            next(err)
        }
    }
}

module.exports = TodoController