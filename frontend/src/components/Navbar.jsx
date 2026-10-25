import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { Shield, LogOut, CheckCircle2, Menu, X, ArrowUpRight } from 'lucide-react';

const Navbar = () => {
  const { teacher, logoutTeacher, teamLeadData, logoutTeamLead } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#E2DFD7]">
      {/* Top Announcement Bar (Finisterre style utility ticker) */}
      <div className="finisterre-ticker py-1.5 sm:py-2 px-3 sm:px-4 text-center tracking-widest border-b border-black/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] sm:text-[11px]">
          <span className="hidden sm:inline">CENTRALIZED ACADEMIC REPOSITORY • EST. 2026</span>
          <span className="mx-auto sm:mx-0 truncate">
            YEAR → SECTION → TEAM • STRICT ONE-TIME SUBMISSION PROTOCOL
          </span>
          <span className="hidden md:inline">PEOPLE • INNOVATION • ENVIRONMENT</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="shrink-0">
            <Logo size="md" variant="dark" />
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-6">
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
              <div className="flex items-center space-x-3 pl-4 border-l border-[#E2DFD7]">
                <Link
                  to="/teacher/dashboard"
                  className="font-display text-xs uppercase tracking-wider font-bold transition py-1.5 px-3 bg-[#19323F] text-white hover:bg-[#C85A32] flex items-center space-x-1"
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
                className="font-display text-xs uppercase tracking-wider font-semibold py-1.5 px-3 border border-[#141719] text-[#141719] hover:bg-[#141719] hover:text-white transition duration-200"
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

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center space-x-2 md:hidden">
            {teacher && (
              <Link
                to="/teacher/dashboard"
                className="p-2 bg-[#19323F] text-white text-[10px] font-mono uppercase font-bold flex items-center space-x-1"
                title="Faculty Portal"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Portal</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#141719] bg-[#F8F7F4] border border-[#E2DFD7] hover:bg-[#EFECE6] transition"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2DFD7] bg-[#F8F7F4] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn">
          {/* Active Lead Notice if signed in */}
          {teamLeadData && (
            <div className="p-3 bg-[#EFECE6] border border-[#E2DFD7] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#C85A32]" />
                <div className="text-xs font-mono text-[#141719]">
                  Signed in as <strong>{teamLeadData.teamName}</strong> Lead
                </div>
              </div>
              <button
                onClick={logoutTeamLead}
                className="text-xs font-mono text-[#C85A32] font-bold underline"
              >
                Sign out
              </button>
            </div>
          )}

          {/* Mobile Nav Links */}
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              className={`px-3 py-3 font-display text-sm uppercase tracking-wider font-semibold border-l-2 transition ${
                isActive('/')
                  ? 'border-[#C85A32] bg-white text-[#141719]'
                  : 'border-transparent text-[#484F56] hover:bg-white'
              }`}
            >
              Project Showcase
            </Link>

            <Link
              to="/register"
              className={`px-3 py-3 font-display text-sm uppercase tracking-wider font-semibold border-l-2 transition ${
                isActive('/register')
                  ? 'border-[#C85A32] bg-white text-[#141719]'
                  : 'border-transparent text-[#484F56] hover:bg-white'
              }`}
            >
              Register Capstone Team
            </Link>

            <Link
              to="/upload"
              className={`px-3 py-3 font-display text-sm uppercase tracking-wider font-semibold border-l-2 transition ${
                isActive('/upload')
                  ? 'border-[#C85A32] bg-white text-[#141719]'
                  : 'border-transparent text-[#484F56] hover:bg-white'
              }`}
            >
              Submit Deliverables
            </Link>
          </div>

          {/* Faculty Section on Mobile */}
          <div className="pt-3 border-t border-[#E2DFD7]">
            {teacher ? (
              <div className="space-y-2">
                <div className="px-3 py-1 font-mono text-[11px] text-[#697077]">
                  LOGGED IN AS: <strong className="text-[#141719]">{teacher.name}</strong>
                </div>
                <Link
                  to="/teacher/dashboard"
                  className="w-full finisterre-btn text-xs py-3 justify-center flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4 text-[#C85A32]" />
                  <span>Open Faculty Portal</span>
                </Link>
                <button
                  onClick={() => {
                    logoutTeacher();
                    navigate('/');
                  }}
                  className="w-full text-center text-xs font-mono text-[#C85A32] py-2 hover:underline uppercase tracking-wider"
                >
                  Sign Out Faculty Session
                </button>
              </div>
            ) : (
              <Link
                to="/teacher/login"
                className="w-full finisterre-btn-outline text-xs py-3 justify-center flex items-center space-x-2"
              >
                <Shield className="w-4 h-4 text-[#C85A32]" />
                <span>Faculty Evaluator Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
