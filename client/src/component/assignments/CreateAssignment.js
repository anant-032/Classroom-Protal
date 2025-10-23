const React = require('react');
const { useState } = React;
const axios = require('axios');

function CreateAssignment() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/assignments', { title, description })
            .then(() => {
                alert('Assignment created successfully!');
                setTitle('');
                setDescription('');
            })
            .catch(err => console.error('Error creating assignment:', err));
    };

    return (
        <div>
            <h2>Create Assignment</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <br />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

module.exports = CreateAssignment;
