const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/findUser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

//Route 1: CREATE
router.post('/addnote', fetchuser, [
    //Check
    body('title', 'Enter title of altleast length 3').isLength({ min : 3}),
    body('description', 'Must contain 5 characters').isLength({min: 5})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //Collecting info from user
    const {title, description, tags} = req.body;
    try {
        const notes = new Notes({
            title, description, tags, user: req.user.id
        })
        
        //Save notes in database
        const savedNotes = await notes.save()
        res.send(savedNotes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

//Rotue 2: READ
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        //Collect all the notes of a particular user
        const notes = await Notes.find({user: req.user.id})
        res.json(notes)
    } catch (error) {
        // console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})


//ROUTE 3: UPDATE
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //Collecting info from user
    const {title, description, tags} = req.body;
    try {
        const newNote = {}
        if(title) newNote.title = title
        if(description) newNote.description = description
        if(tags) newNote.tags = tags
    
        //Find the notes of a particular id of a user
        let notes = await Notes.findById(req.params.id)
        if(!notes) return res.status(404).send("No user found")
    
        //To check whether different user is trying to edit the another user notes
        if(notes.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }
        
        //Upadates the notes
        notes = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({notes})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})


//ROUTE 4: DELETE
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let notes = await Notes.findById(req.params.id)
        if(!notes) return res.status(404).send("No user found")
    
        //To check whether different user is trying to edit the another user notes
        if(notes.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }
        
        //Upadates the notes
        notes = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Sucess": "Note has been deleted", notes: notes})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})
module.exports = router