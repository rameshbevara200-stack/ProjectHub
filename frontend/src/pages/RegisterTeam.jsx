import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Logo from '../components/Logo';
import {
  Users,
  Compass,
  ArrowRight,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  FolderTree,
} from 'lucide-react';

const RegisterTeam = () => {
  const { registerStudentTeam } = useAuth();
  const navigate = useNavigate();

  // Academic metadata
  const [years, setYears] = useState([]);
  const [sections, setSections] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Form state
  const [yearId, setYearId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Team members list
  const [members, setMembers] = useState([
    { name: '', rollNumber: '' },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch Years and Sections
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [yrRes, secRes] = await Promise.all([
          api.get('/academic/years'),
          api.get('/academic/sections'),
        ]);
        setYears(yrRes.data);
        setSections(secRes.data);
      } catch (err) {
        console.error('Failed to load academic years and sections:', err);
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMetadata();
  }, []);

  // Filtered sections for selected year
  const availableSections = sections.filter(
    (s) => !yearId || s.yearId?._id === yearId || s.yearId === yearId
  );

  // Member management
  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const addMember = () => {
    setMembers([...members, { name: '', rollNumber: '' }]);
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      setMembers(members.filter((_, idx) => idx !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!yearId) return setError('Please select an Academic Year (Cohort).');
    if (!sectionId) return setError('Please select a Branch / Section.');
    if (!teamName.trim()) return setError('Please enter your Team Name.');
    if (!leadName.trim()) return setError('Please enter Team Lead Name.');
    if (!leadEmail.trim()) return setError('Please enter Team Lead Email.');
    if (password.length < 6) return setError('Password must be at least 6 characters long.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    // Clean members
    const validMembers = members
      .map((m) => ({ name: m.name.trim(), rollNumber: m.rollNumber.trim() }))
      .filter((m) => m.name.length > 0);

    setSubmitting(true);

    const res = await registerStudentTeam({
      yearId,
      sectionId,
      teamName: teamName.trim(),
      description: description.trim(),
      leadName: leadName.trim(),
      leadEmail: leadEmail.trim(),
      password,
      members: validMembers,
    });

    setSubmitting(false);

    if (res.success) {
      // Successfully registered & auto-authenticated! Redirect to project upload portal
      navigate('/upload');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Editorial Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 font-mono text-[11px] tracking-widest uppercase text-[#C85A32]">
          <Compass className="w-3.5 h-3.5" />
          <span>CAPSTONE TEAM SELF-SERVICE PROTOCOL</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#141719]">
          Student Team Registration
        </h1>
        <p className="text-xs sm:text-sm text-[#697077] max-w-xl mx-auto font-light leading-relaxed">
          Create your capstone team, designate your team lead credentials, select your academic cohort, and enroll your student research members.
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="bg-white border border-[#E2DFD7] p-6 sm:p-10 shadow-2xs space-y-8">
        {/* Step indicator header */}
        <div className="flex items-center justify-between border-b border-[#E2DFD7] pb-4">
          <div className="flex items-center space-x-3">
            <Logo size="sm" showText={false} />
            <div>
              <h2 className="font-display text-sm uppercase tracking-wider font-bold text-[#141719]">
                Team Enrollment Form
              </h2>
              <p className="text-[11px] text-[#697077] font-mono">
                All fields marked with <span className="text-[#C85A32]">*</span> are required
              </p>
            </div>
          </div>

          <Link
            to="/upload"
            className="text-xs font-mono text-[#C85A32] hover:underline uppercase tracking-wider hidden sm:block"
          >
            Already registered? Sign In →
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-[#C85A32]/10 border border-[#C85A32] flex items-start space-x-2 text-xs font-mono text-[#C85A32]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: ACADEMIC COHORT & PLACEMENT */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#141719] flex items-center space-x-2 pb-2 border-b border-[#E2DFD7]">
              <FolderTree className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>01. Academic Placement</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                  Academic Year / Cohort <span className="text-[#C85A32]">*</span>
                </label>
                <select
                  required
                  value={yearId}
                  onChange={(e) => {
                    setYearId(e.target.value);
                    setSectionId('');
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono uppercase tracking-wider text-[#141719] focus:outline-hidden focus:border-[#141719]"
                >
                  <option value="">Select Academic Year</option>
                  {years.map((y) => (
                    <option key={y._id} value={y._id}>
                      {y.name}
                    </option>
                  ))}
                </select>
                {years.length === 0 && !loadingMeta && (
                  <span className="text-[10px] text-[#C85A32] font-mono mt-1 block">
                    No academic years created yet. Please ask your faculty member to initialize a cohort.
                  </span>
                )}
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                  Branch / Section <span className="text-[#C85A32]">*</span>
                </label>
                <select
                  required
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  disabled={!yearId}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono uppercase tracking-wider text-[#141719] focus:outline-hidden focus:border-[#141719] disabled:opacity-50"
                >
                  <option value="">
                    {yearId ? 'Select Branch / Section' : 'Select Academic Year first'}
                  </option>
                  {availableSections.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: TEAM IDENTITY */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#141719] flex items-center space-x-2 pb-2 border-b border-[#E2DFD7]">
              <Users className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>02. Team Identity & Scope</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                  Team Name <span className="text-[#C85A32]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WaveRiders / Autonomous Tech"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-sans text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                  Project Domain / Theme
                </label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence, IoT, Cloud Computing"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-sans text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: TEAM LEAD CREDENTIALS */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#141719] flex items-center space-x-2 pb-2 border-b border-[#E2DFD7]">
              <Lock className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>03. Designated Team Lead Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                  Lead Full Name <span className="text-[#C85A32]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-sans text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                  Lead Email Address <span className="text-[#C85A32]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. s240676@rguktsklm.ac.in"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                />
                <span className="text-[10px] text-[#697077] font-mono mt-1 block">
                  Registration receipt and evaluation scorecard will be sent to this email.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                  Choose Login Password <span className="text-[#C85A32]">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                  Confirm Password <span className="text-[#C85A32]">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: TEAM MEMBERS ROSTER */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2DFD7]">
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#141719] flex items-center space-x-2">
                <Users className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>04. Co-Researchers / Team Members</span>
              </h3>

              <button
                type="button"
                onClick={addMember}
                className="font-mono text-[11px] text-[#C85A32] hover:text-[#B34A24] inline-flex items-center space-x-1 font-semibold uppercase tracking-wider"
              >
                <Plus className="w-3 h-3" />
                <span>Add Member</span>
              </button>
            </div>

            <p className="text-[11px] text-[#697077] font-mono">
              List the other students working in your capstone team (excluding the Team Lead).
            </p>

            <div className="space-y-2.5">
              {members.map((member, idx) => (
                <div key={idx} className="flex items-center space-x-3 bg-[#F8F7F4] p-3 border border-[#E2DFD7]">
                  <span className="font-mono text-xs font-bold text-[#697077] w-6 text-center">
                    {idx + 1}.
                  </span>

                  <input
                    type="text"
                    placeholder="Student Full Name"
                    value={member.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-[#E2DFD7] text-xs font-sans text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                  />

                  <input
                    type="text"
                    placeholder="Roll Number / Student ID (e.g. 21CSE042)"
                    value={member.rollNumber}
                    onChange={(e) => handleMemberChange(idx, 'rollNumber', e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-[#E2DFD7] text-xs font-mono text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                  />

                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="p-1.5 text-[#697077] hover:text-[#C85A32] transition"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submission Notice & Action */}
          <div className="p-4 bg-[#F8F7F4] border-l-2 border-[#C85A32] font-mono text-xs text-[#697077] leading-relaxed">
            <strong className="text-[#141719]">REGISTRATION CONFIRMATION:</strong> By completing registration, you will be authenticated as the designated Team Lead. An official enrollment receipt will be emailed to your registered address.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Link
              to="/upload"
              className="text-xs font-mono text-[#697077] hover:text-[#141719] underline uppercase tracking-wider"
            >
              ← Back to Lead Sign In
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto finisterre-btn-rust text-xs px-8 py-3.5 justify-center"
            >
              <span>{submitting ? 'Registering Team...' : 'Register Team & Proceed'}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterTeam;

