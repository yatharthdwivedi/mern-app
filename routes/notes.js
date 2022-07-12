const express = require("express");
const fetch = require("../middleware/fetch");
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const router = express.Router();

router.get("/notes", fetch, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

router.post(
  "/addnote",
  fetch,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error");
    }
  }
);

router.put("/updatenote/:id", fetch, async (req, res) => {
  const { title, description, tag } = req.body;

  const newNote = {};

  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  let note = await Note.findById(req.params.id);
  if (!note) {
    res.status(404).send("Not Found");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }
  note = await Note.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json(note);
  console.log(note);
});

router.delete(
     "/deletenote/:id",
     fetch,async (req,res)=>{

          let note = await Note.findById(req.params.id)
          if(!note){
               res.status(404).send("Not Found")
          }

          if(note.user.toString()!== req.user.id){
               res.status(401).send("Not Allowed")
          }

          note = await Note.findByIdAndDelete(req.params.id)
          res.json({"Success": "Note is deleted"})
     })

module.exports = router;
