import React, { useState } from 'react';

const PRIORITY_STYLES = {
    Low: 'badge-low',
    Medium: 'badge-medium',
    Highest: 'badge-highest'
};

export default function NoteCard({ note, currentUser, onEdit, onDuplicate, onDelete, onUpdate }) {
    const [showPinPrompt, setShowPinPrompt] = useState(false);
    const [pinInput, setPinInput] = useState('');

    const handleEditClick = () => {
        if (note.locked && note.creatorName !== currentUser) {
            setShowPinPrompt(true);
        } else {
            onEdit(note);
        }
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        if (pinInput === note.pin) {
            setShowPinPrompt(false);
            onEdit(note);
        } else {
            alert('Incorrect PIN');
        }
        setPinInput('');
    };

    const toggleItem = (itemId) => {
        const updatedItems = note.items.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        onUpdate({ ...note, items: updatedItems, updaterName: currentUser });
    };

    // Sort items: unchecked first, checked last
    const sortedItems = note.type === 'list' ? [...note.items].sort((a, b) => {
        if (a.checked === b.checked) return 0;
        return a.checked ? 1 : -1; // true goes after false
    }) : [];

    return (
        <div className="note-card">
            <div className="note-header">
                <div>
                    <h3 className="note-title">
                        {note.locked && '🔒 '}
                        {note.title || 'Untitled'}
                    </h3>
                    <div className="note-meta">
                        <span className={`badge ${PRIORITY_STYLES[note.priority]}`}>{note.priority}</span>
                        {note.timestamp && <span>⏱ {new Date(note.timestamp).toLocaleString()}</span>}
                    </div>
                </div>
                <div className="note-actions">
                    <button className="btn-icon" onClick={handleEditClick} title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                    </button>
                    <button className="btn-icon" onClick={() => onDuplicate(note)} title="Duplicate">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                    </button>
                    <button className="btn-icon" onClick={() => onDelete(note.id)} title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                    </button>
                </div>
            </div>

            {showPinPrompt ? (
                <form onSubmit={handlePinSubmit} style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>This note is locked by {note.creatorName}. Enter 4-digit PIN to edit.</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="password"
                            className="input-field"
                            maxLength="4"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            placeholder="PIN"
                            autoFocus
                            required
                            style={{ width: '80px' }}
                        />
                        <button type="submit" className="btn btn-primary">Unlock</button>
                        <button type="button" className="btn btn-danger" onClick={() => setShowPinPrompt(false)}>Cancel</button>
                    </div>
                </form>
            ) : null}

            <div className="note-content">
                {note.type === 'text' ? (
                    <div>{note.content}</div>
                ) : (
                    <div>
                        {sortedItems.map(item => (
                            <label key={item.id} className={`list-item ${item.checked ? 'checked' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => toggleItem(item.id)}
                                    disabled={note.locked && note.creatorName !== currentUser}
                                />
                                <span>{item.text}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="note-footer">
                <div className="note-users">
                    <div>Created by: <strong>{note.creatorName}</strong></div>
                    {note.updaterName && note.updaterName !== note.creatorName && (
                        <div>Updated by: <strong>{note.updaterName}</strong></div>
                    )}
                </div>
                {note.createdAt && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(note.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                )}
            </div>
        </div>
    );
}
