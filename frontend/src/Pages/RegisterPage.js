import React, { useState } from 'react';
// import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    isDoctor: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically interact with your smart contract
    console.log('Form submitted:', formData);
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />
        <input
          type="text"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          placeholder="Gender"
          required
        />
        <label>
          <input
            type="checkbox"
            name="isDoctor"
            checked={formData.isDoctor}
            onChange={handleChange}
          />
          I am a doctor
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;