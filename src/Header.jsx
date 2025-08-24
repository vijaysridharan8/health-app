import React from 'react';
import './Header.css';
import { FaGlobe } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="header-root">
      <div className="header-left">
          <span className="header-title">
            Health<span className="header-title-bold">Choice</span>
          </span>
      </div>
      <div className="header-right">
        <FaGlobe className="header-globe" />
        <span className="header-language">Language</span>
      </div>
    </header>
  );
}
