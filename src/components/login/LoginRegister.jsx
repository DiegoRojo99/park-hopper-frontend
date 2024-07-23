import React, { useState } from 'react';
import './LoginRegister.css';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';
import { auth } from '../../Firebase';

const LoginRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL; 

  async function login(email, password){
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User logged in:', user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error logging in:', errorCode, errorMessage);
    }
  }

  async function register(email, password){
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const response = await fetch(`${apiUrl}/createUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, uid: user.uid })
        });
        if (!response.ok) {
          throw new Error('Failed to add user to database');
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error logging in:', errorCode, errorMessage);
      });    
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if(isLogin){
      login(email, password);
    }
    else{
      register(email, password);
    }
  };

  return (
    <div className="login-register-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        { !isLogin &&
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        }
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Don\'t have an account? Register here' : 'Already have an account? Login here'}
      </p>
    </div>
  );
};

export default LoginRegister;