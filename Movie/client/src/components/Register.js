import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './login.css';
import axios from 'axios';  // Ensure axios is installed

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the registration endpoint
      const response = await axios.post('http://localhost:5002/api/register', {
        name,  // Update field name to match the backend
        email,
        phone,  // Ensure backend handles this field if necessary
        password
      });

      // Set success message
      setSuccess('Registration successful! Please log in.');
      setError('');
    } catch (err) {
      // Set error message if registration fails
      setError(err.response?.data?.message || 'Registration failed.');
      setSuccess('');
    }
  };

  return (
    <div className="cards1">
      <Card style={{ width: '25rem', padding: '1rem' }}>
        <center>
          <Card.Title>Sign Up</Card.Title>
        </center>
        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Name:</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address:</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formBasicContact">
              <Form.Label>Phone:</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter mobile number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" style={{ marginTop: '1rem' }}>
              <Form.Label>Password:</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </Form.Group>

            <center>
              <Button className="custom-button" type="submit" style={{ marginTop: '1rem' }}>
                Register
              </Button>
              <br/>
              <a href='/Login'>Login</a><br/>
              <a href='/'>Back to Home page</a> 
            </center>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Register;
