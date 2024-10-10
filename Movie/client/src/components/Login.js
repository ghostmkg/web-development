import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after login
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'; // To make API requests
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5002/api/login', {
        email,
        password
      });

      // Assuming the response contains a JWT token and user info
      const { token, user } = response.data;

      // Store the token in localStorage or cookies
      localStorage.setItem('authToken', token);

      // Redirect to a protected route or home page after successful login
      navigate('/Movieslist'); // Replace with your desired route
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="cards1">
      <Card style={{ width: '25rem', padding: '1rem' }}>
        <center>
          <Card.Title>Login</Card.Title>
        </center>
        <Card.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" style={{ marginTop: '1rem' }}>
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </Form.Group>

            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

            <center>
              <Button className="custom-button" type="submit" style={{ marginTop: '1rem' }}>
                Login
              </Button>
              <p>Don't have an Account? <a href="/Register">SignUp</a></p>
              <a href="/">Back to Home page</a>
            </center>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;
