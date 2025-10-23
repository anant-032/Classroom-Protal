    const React = require('react');
const { useEffect, useState } = React;
const axios = require('axios');

function AssignmentList() {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/assignments')
            .then(res => setAssignments(res.data))
            .catch(err => console.error('Error fetching assignments:', err));
    }, []);

    return (
        <div>
            <h2>Assignments</h2>
            <ul>
                {assignments.map(a => (
                    <li key={a._id}>
                        <strong>{a.title}</strong> - {a.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

module.exports = AssignmentList;
