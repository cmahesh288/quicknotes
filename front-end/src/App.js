import React, {useState, useEffect} from 'react';
import './App.css';
import {FaHeart} from "react-icons/fa";
import {MdEdit} from "react-icons/md";
import {MdDelete} from "react-icons/md";
import {CgNotes} from "react-icons/cg";


function App() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const fetchNotes = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}`);
            const data = await res.json();
            setNotes(data);
        } catch (err) {
            console.error('Error fetching notes:', err);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleAddNote = async () => {
        if (!title || !content) return alert('Please fill in both fields.');
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title, content}),
        });
        const newNote = await res.json();
        setNotes([newNote, ...notes]);
        setTitle('');
        setContent('');
    };

    const handleDeleteNote = async (id) => {
        await fetch(`${process.env.REACT_APP_SERVER_URL}/${id}`, {method: 'DELETE'});
        setNotes(notes.filter((note) => note._id !== id));
    };

    const timeAgo = (date) => {
        const now = new Date();
        const then = new Date(date);
        const diff = Math.floor((now - then) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return '1 day ago';
        return `${diff} days ago`;
    };

    return (
        <>
            <div className="container">

                <h1>QuickNotes 📋</h1>
                <div className="add-note">
                    <h2>Add a Note</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Take a note..."
                        rows="4"
                        value={content}
                        style={{resize: 'vertical'}}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <button onClick={handleAddNote}>Add Note</button>
                </div>

                <div className="notes-section">
                    <h3>My Notes</h3>
                    <small>Recently viewed</small>
                    <div className="notes-grid">
                        {notes.map((note) => (
                            <div className="note-card" key={note._id}>
                                <div className="note-actions">
                                    {/*<button title="Edit"><MdEdit/></button>*/}
                                    <button title="Delete" onClick={() => handleDeleteNote(note._id)}><MdDelete/>
                                    </button>
                                </div>
                                <h4>{note.title}</h4>
                                <p>{note.content.length > 150 ? note.content.slice(0, 150) + '...' : note.content}</p>
                                <small>{timeAgo(note.createdAt)}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
