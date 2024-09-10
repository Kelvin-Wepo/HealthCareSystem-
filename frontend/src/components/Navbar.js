import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">Healthcare Token System</Link>
        <div>
          <Link to="/" className="text-white mr-4">Home</Link>
          <Link to="/appointments" className="text-white">Appointments</Link>
          <Link to="/Register" className="text-white">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
