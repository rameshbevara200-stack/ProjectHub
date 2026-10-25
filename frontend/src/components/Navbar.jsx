import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { Shield, ArrowUpRight, LogOut, CheckCircle2 } from 'lucide-react';

const Navbar = () => {
  const { teacher, logoutTeacher, teamLeadData, logoutTeamLead } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E2DFD7]">
      {/* Top Announcement Bar (Finisterre style utility ticker) */}
      <div className="finisterre-ticker py-2 px-4 text-center tracking-widest border-b border-black/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px]">
          <span className="hidden sm:inline">CENTRALIZED ACADEMIC REPOSITORY • EST. 2026</span>
          <span className="mx-auto sm:mx-0">
            YEAR → SECTION → TEAM • STRICT ONE-TIME SUBMISSION PROTOCOL
          </span>
          <span className="hidden md:inline">PEOPLE • INNOVATION • ENVIRONMENT</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/">
            <Logo size="md" variant="dark" />
          </Link>

          {/* Nav Items */}
          <nav className="flex items-center space-x-1 sm:space-x-6">
            <Link
              to="/"
              className={`font-display text-xs uppercase tracking-wider font-semibold transition-colors duration-150 py-2 border-b-2 ${
                isActive('/')
                  ? 'border-[#C85A32] text-[#141719]'
                  : 'border-transparent text-[#697077] hover:text-[#141719]'
              }`}
            >
              Showcase
            </Link>

            <Link
              to="/register"
              className={`font-display text-xs uppercase tracking-wider font-semibold transition-colors duration-150 py-2 border-b-2 ${
                isActive('/register')
                  ? 'border-[#C85A32] text-[#141719]'
                  : 'border-transparent text-[#697077] hover:text-[#141719]'
              }`}
            >
              Register Team
            </Link>

            <Link
              to="/upload"
              className={`font-display text-xs uppercase tracking-wider font-semibold transition-colors duration-150 py-2 border-b-2 ${
                isActive('/upload')
                  ? 'border-[#C85A32] text-[#141719]'
                  : 'border-transparent text-[#697077] hover:text-[#141719]'
              }`}
            >
              Submit Project
            </Link>

            {/* Teacher Dashboard or Login */}
            {teacher ? (
              <div className="flex items-center space-x-3 pl-2 sm:pl-4 border-l border-[#E2DFD7]">
                <Link
                  to="/teacher/dashboard"
                  className={`font-display text-xs uppercase tracking-wider font-bold transition py-1.5 px-3 bg-[#19323F] text-white hover:bg-[#C85A32] flex items-center space-x-1`}
                >
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  <span>Faculty Portal</span>
                </Link>

                <button
                  onClick={() => {
                    logoutTeacher();
                    navigate('/');
                  }}
                  title="Sign Out Faculty"
                  className="p-1.5 text-[#697077] hover:text-[#C85A32] transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/teacher/login"
                className={`font-display text-xs uppercase tracking-wider font-semibold py-1.5 px-3 border border-[#141719] text-[#141719] hover:bg-[#141719] hover:text-white transition duration-200`}
              >
                Faculty Access
              </Link>
            )}

            {/* Active Team Lead Indicator */}
            {teamLeadData && (
              <div className="hidden lg:flex items-center space-x-2 bg-[#EFECE6] border border-[#E2DFD7] px-3 py-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C85A32]" />
                <span className="font-mono text-[11px] text-[#141719]">
                  LEAD: <strong>{teamLeadData.teamName}</strong>
                </span>
                <button
                  onClick={logoutTeamLead}
                  className="text-[#697077] hover:text-[#C85A32] font-bold text-sm ml-1"
                  title="Sign out Team Lead"
                >
                  &times;
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
