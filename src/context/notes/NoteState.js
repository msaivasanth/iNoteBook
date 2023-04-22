import { useState } from "react";
import noteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial);
  //Fetch
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authToken": localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    setNotes(json)
  }

//Add
const addNote = async (title, description, tags) => {
  const response = await fetch(`${host}/api/notes/addnote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authToken": localStorage.getItem('token')
    },

    body: JSON.stringify({title, description, tags}), // body data type must match "oCntent-Type" header
  });
  const note = await response.json();
  
  setNotes(notes.concat(note))
}

//Delete
const deleteNote = async (id) => {
  let url = `${host}/api/notes/deletenotes/${id}`
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "authToken": localStorage.getItem('token')
    },
  });
  const json = await response.json();
  console.log(json);
  const newNotes = notes.filter((note) => note._id !== id)
  setNotes(newNotes);
}

//Edit
const editNote = async (id, title, description, tags) => {
  let url = `${host}/api/notes/updatenotes/${id}`
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "authToken": localStorage.getItem('token')
    },

    body: JSON.stringify({id, title, description, tags}), // body data type must match "Content-Type" header
  });
  const json = await response.json();
  console.log(json)
  let newNotes = JSON.parse(JSON.stringify(notes))
  for (let index = 0; index < newNotes.length; index++) {
    const element = newNotes[index];
    if (element._id === id) {
      newNotes[index].title = title
      newNotes[index].description = description
      newNotes[index].tags = tags

      break;
    }
  }
  // console.log(newNotes)
  setNotes(newNotes)
}
return (
  <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
    {props.children}
  </noteContext.Provider>
)
}

export default NoteState;

