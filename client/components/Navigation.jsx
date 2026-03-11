import { Outlet, NavLink } from 'react-router-dom';
// nav collapse feature for small device widths
import 'bootstrap/js/src/collapse.js';
import ResolutionLogo from '../img/resolution_app_logo_mini.svg';
import { useState, useEffect } from 'react';

const Navigation = () => {
  // state for navigation collapse
  const [collapseNav, setCollapseNav] = useState(true);

  // state for width of app window to later create conditional based on window width
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
  });

  // auto-close menu on click of NavLink
  const handleCollapseNav = () => {
    if (windowSize.width < 767) {
      setCollapseNav(!collapseNav);
    }
  };

  // listen for window width resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };
    window.addEventListener('resize', handleResize);
    // clean up event listener every time useEffect runs
    return () => window.removeEventListener('resize', handleResize);
  });

  return (
    <>
      <nav className="navbar navbar-expand-md fixed-top navbar-light bg-light">
        <div className="container">
          <NavLink className="nav-link navbar-brand active" href="#" to="/Home">
            <img
              src={ResolutionLogo}
              alt="Resolution Logo"
              style={{ width: 'auto', height: '2.5em' }}
            />
          </NavLink>
          <button
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarToggleTarget"
            aria-controls="navbarExpansion"
            aria-expanded="false"
            aria-label="Toggles Navigation"
            className="navbar-toggler"
            onClick={handleCollapseNav}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`navbar-collapse ${collapseNav ? 'collapse' : ''}`}
            id="navbarToggleTarget"
          >
            <ul className="navbar-nav mr-auto mt-1 mt-lg-0">
              <li className="nav-item" role="navigation">
                <NavLink
                  className="nav-link"
                  href="#"
                  to="/Messages"
                  onClick={handleCollapseNav}
                >
                  Meme Messenger
                </NavLink>
              </li>
              <li className="nav-item" role="navigation">
                <NavLink
                  className="nav-link"
                  href="#"
                  to="/MoodNotes"
                  onClick={handleCollapseNav}
                >
                  MoodNotes
                </NavLink>
              </li>
              <li className="nav-item" role="navigation">
                <NavLink
                  className="nav-link"
                  href="#"
                  to="/DecisionMaker"
                  onClick={handleCollapseNav}
                >
                  Decision Maker
                </NavLink>
              </li>
              <li className="nav-item" role="navigation">
                <NavLink
                  className="nav-link"
                  href="#"
                  to="/WallOfFame"
                  onClick={handleCollapseNav}
                >
                  Wall Of Fame
                </NavLink>
              </li>
              <li className="nav-item" role="navigation">
                <NavLink
                  className="nav-link"
                  href="#"
                  to="/RewardsStore"
                  onClick={handleCollapseNav}
                >
                  Rewards Store
                </NavLink>
              </li>
              <li className="nav-item" role="navigation">
                <NavLink
                  className="nav-link"
                  href="#"
                  to="/MoodGame"
                  onClick={handleCollapseNav}
                >
                  MoodGame
                </NavLink>
              </li>
              <li className="nav-item" role="navigation">
                <NavLink
                  className="nav-link"
                  href="#"
                  to="/Controversy"
                  onClick={handleCollapseNav}
                >
                  Controversy
                </NavLink>
              </li>
              <li className="nav-item" role="navigation">
                <NavLink
                  className="nav-link"
                  href="#"
                  to="/Overview"
                  onClick={handleCollapseNav}
                >
                  Overview
                </NavLink>
              </li>
              <li className="nav-item" role="navigation">
                <NavLink
                  className="nav-link"
                  href="#"
                  to="/UserProfile"
                  onClick={handleCollapseNav}
                >
                   My Profile
                </NavLink>
              </li>
              <li className="nav-item" role="navigation">
                <NavLink
                  className="nav-link"
                  href="#"
                  to="/SeeJudge"
                  onClick={handleCollapseNav}
                >
                  See Judge
                </NavLink>
              </li>
              <li className="nav-item" role="navigation">
                <NavLink
                  className="nav-link"
                  href="#"
                  to="/Whack"
                  onClick={handleCollapseNav}
                >
                  Whack
                </NavLink>
              </li>
              <li className="nav-item" role="navigation">
                <NavLink
                  className="nav-link"
                  href="#"
                  to="/hatemail"
                  onClick={handleCollapseNav}
                >
                  HateMail
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navigation;
