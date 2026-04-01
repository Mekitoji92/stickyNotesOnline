import React, { useState, useEffect } from 'react';
import NoteCard from './NoteCard';
import NoteEditor from './NoteEditor';

export default function Dashboard({ user, onLogout }) {
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    // Load state and listen to cross-tab updates
    useEffect(() => {
        const loadNotes = () => {
            const savedNotes = localStorage.getItem('sno_notes');
            if (savedNotes) {
                setNotes(JSON.parse(savedNotes));
            }
        };

        loadNotes();

        const handleStorageChange = (e) => {
            if (e.key === 'sno_notes') {
                loadNotes();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Save utility to persist and update state locally
    const saveNotes = (updatedNotes) => {
        localStorage.setItem('sno_notes', JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
    };

    const handleCreateNew = () => {
        setEditingNote(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (note) => {
        setEditingNote(note);
        setIsEditorOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            const updatedNotes = notes.filter(n => n.id !== id);
            saveNotes(updatedNotes);
        }
    };

    const handleDuplicate = (note) => {
        const duplicatedObj = {
            ...note,
            id: Date.now().toString(),
            title: `${note.title} (Copy)`,
            creatorName: user,
            updaterName: user,
            createdAt: new Date().toISOString()
        };
        saveNotes([duplicatedObj, ...notes]);
    };

    const handleUpdate = (updatedNote) => {
        const updatedNotes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
        saveNotes(updatedNotes);
    };

    const handleSaveEditor = (noteData) => {
        let updatedNotes;
        if (editingNote) {
            // update
            updatedNotes = notes.map(n => n.id === noteData.id ? noteData : n);
        } else {
            // create
            updatedNotes = [noteData, ...notes];
        }
        saveNotes(updatedNotes);
        setIsEditorOpen(false);
        setEditingNote(null);
    };

    const closeEditor = () => {
        setIsEditorOpen(false);
        setEditingNote(null);
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Sticky Notes Online</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="user-badge">
                        👤 {user}
                    </div>
                    <button className="btn btn-danger" onClick={onLogout}>Logout</button>
                </div>
            </header>

            <div style={{ marginBottom: '2rem' }}>
                <button className="btn btn-primary" onClick={handleCreateNew}>
                    + Create New Note
                </button>
            </div>

            <div className="notes-grid">
                {notes.map(note => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        currentUser={user}
                        onEdit={handleEdit}
                        onDuplicate={handleDuplicate}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                    />
                ))}
                {notes.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <p>No notes found. Create one to get started!</p>
                    </div>
                )}
            </div>

            {isEditorOpen && (
                <NoteEditor
                    note={editingNote}
                    currentUser={user}
                    onSave={handleSaveEditor}
                    onCancel={closeEditor}
                />
            )}
        </div>
    );
}
