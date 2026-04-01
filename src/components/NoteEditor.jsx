import React, { useState, useEffect } from 'react';

export default function NoteEditor({ note, currentUser, onSave, onCancel }) {
    const isNew = !note;
    const [formData, setFormData] = useState({
        title: '',
        type: 'text',
        content: '',
        items: [],
        priority: 'Low',
        timestamp: '',
        locked: false,
        pin: ''
    });

    const [newItemText, setNewItemText] = useState('');

    useEffect(() => {
        if (note) {
            setFormData({
                title: note.title || '',
                type: note.type || 'text',
                content: note.content || '',
                items: note.items || [],
                priority: note.priority || 'Low',
                timestamp: note.timestamp || '',
                locked: note.locked || false,
                pin: note.pin || ''
            });
        }
    }, [note]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItemText.trim()) return;
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { id: Date.now().toString(), text: newItemText.trim(), checked: false }]
        }));
        setNewItemText('');
    };

    const handleRemoveItem = (id) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation for PIN
        if (formData.locked && formData.pin.length !== 4) {
            alert('Locked notes must have a exactly 4-digit PIN.');
            return;
        }

        const updatedNote = {
            ...formData,
            id: isNew ? Date.now().toString() : note.id,
            creatorName: isNew ? currentUser : note.creatorName,
            updaterName: currentUser,
            createdAt: isNew ? new Date().toISOString() : note.createdAt
        };

        onSave(updatedNote);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{isNew ? 'Create New Note' : 'Edit Note'}</h2>
                    <button className="btn-icon" onClick={onCancel}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            className="input-field"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Note title"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Type</label>
                            <select name="type" className="input-field" value={formData.type} onChange={handleChange}>
                                <option value="text">Text Note</option>
                                <option value="list">Shopping List</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select name="priority" className="input-field" value={formData.priority} onChange={handleChange}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="Highest">Highest</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Deadline / Timestamp</label>
                        <input
                            type="datetime-local"
                            name="timestamp"
                            className="input-field"
                            value={formData.timestamp}
                            onChange={handleChange}
                        />
                    </div>

                    {formData.type === 'text' ? (
                        <div className="form-group">
                            <label>Content</label>
                            <textarea
                                name="content"
                                className="input-field"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Note contents..."
                                rows="4"
                            ></textarea>
                        </div>
                    ) : (
                        <div className="form-group">
                            <label>List Items</label>
                            <div style={{ marginBottom: '1rem' }}>
                                {formData.items.map(item => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ flex: 1 }}>{item.text}</span>
                                        <button type="button" className="btn-icon" onClick={() => handleRemoveItem(item.id)}>✕</button>
                                    </div>
                                ))}
                                {formData.items.length === 0 && <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No items added yet.</span>}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={newItemText}
                                    onChange={e => setNewItemText(e.target.value)}
                                    placeholder="Add item..."
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddItem(e))}
                                />
                                <button type="button" className="btn btn-primary" onClick={handleAddItem}>Add</button>
                            </div>
                        </div>
                    )}

                    <div className="form-row" style={{ alignItems: 'flex-end', marginTop: '1.5rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="locked"
                                    checked={formData.locked}
                                    onChange={handleChange}
                                    style={{ width: '1.2rem', height: '1.2rem' }}
                                />
                                Lock this note
                            </label>
                        </div>

                        {formData.locked && (
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>PIN Code</label>
                                <input
                                    type="password"
                                    name="pin"
                                    className="input-field"
                                    maxLength="4"
                                    value={formData.pin}
                                    onChange={handleChange}
                                    placeholder="4 digits"
                                    pattern="\d{4}"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" className="btn btn-danger" onClick={onCancel}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Note</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
