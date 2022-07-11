import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  return (
    <>
      <NavLink to="/" className={({ isActive }) => (isActive ? 'a' : 'b')}>
        Home
      </NavLink>
      <NavLink to="/speak" className={({ isActive }) => (isActive ? 'c' : 'd')}>
        Speak
      </NavLink>
      <NavLink to="/topik" className={({ isActive }) => (isActive ? 'c' : 'd')}>
        TOPIK
      </NavLink>
      <NavLink to="/report" className={({ isActive }) => (isActive ? 'c' : 'd')}>
        Report
      </NavLink>
    </>
  );
};

export default Nav;
