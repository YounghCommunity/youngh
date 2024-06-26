import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    userType: 'mentee', 
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [error, setError] = useState(null);

  // Add these states for selected options
  const [selectedSkills, setSelectedSkills] = useState('');
  const [selectedJobTitles, setSelectedJobTitles] = useState('');
  const [selectedJobCategories, setSelectedJobCategories] = useState('');

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    try {
      const url = `http://localhost:5000/api/auth/login`;
      const response = await axios.post(url, { username: formData.username, password: formData.password });
      if (response.status === 200) {
        setUser(response.data.user);
        navigate('/');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Login failed');
    }
  };

  const register = async () => {
    try {
      const url = `http://localhost:5000/api/auth/register?userType=mentee`;
      const response = await axios.post(url, formData);
      if (response.status === 200) {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setUser(response.data.user);
          navigate('/');
        }
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  const [mentorFormData, setMentorFormData] = useState({
    username: '',
    password: '',
    email: '',
    description: '',
    jobTitle: '',
    jobCategory: '',
    skills: [], 
    userType: 'mentor',
  });

  const handleChangeMentor = (e) => {
    setMentorFormData({ ...mentorFormData, [e.target.name]: e.target.value });
  };

  const registerMentor = async (formData) => {
    try {
      const url = `http://localhost:5000/api/auth/register?userType=mentor`;
      const response = await axios.post(url, formData);
      if (response.status === 200) {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setUser(response.data.user);
          navigate('/');
        }
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Registration failed');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      formData, 
      handleChange, 
      login, 
      register, 
      mentorFormData, 
      handleChangeMentor, 
      registerMentor, 
      user, 
      logout, 
      error,
      selectedSkills,           // Expose selectedSkills
      setSelectedSkills,        // Function to set selectedSkills
      selectedJobTitles,        // Expose selectedJobTitles
      setSelectedJobTitles,     // Function to set selectedJobTitles
      selectedJobCategories,    // Expose selectedJobCategories
      setSelectedJobCategories // Function to set selectedJobCategories
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
