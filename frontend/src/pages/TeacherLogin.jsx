import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import api from '../services/api';
import { Shield, Lock, Mail, ArrowRight, AlertTriangle, KeyRound } from 'lucide-react';

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Initial Master Setup state (only triggered if zero faculty exist in DB)
  const [needsInitialSetup, setNeedsInitialSetup] = useState(false);
  const [setupName, setSetupName] = useState('');
  const [setupDept, setSetupDept] = useState('');

  const { loginTeacher } = useAuth();
  const navigate = useNavigate();

  // Check if system requires initial master faculty setup
  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const res = await api.get('/auth/teacher/setup-status');
        if (res.data?.needsInitialSetup) {
          setNeedsInitialSetup(true);
        }
      } catch (err) {
        // Silent catch if offline or error
      }
    };
    checkSetupStatus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // If initial setup is required
    if (needsInitialSetup) {
      try {
        const res = await api.post('/auth/teacher/initial-setup', {
          name: setupName.trim(),
          email: email.trim(),
          password,
          department: setupDept.trim() || 'Computer Science & Engineering',
        });
        const { token, ...userData } = res.data;
        localStorage.setItem('teacherToken', token);
        localStorage.setItem('teacherUser', JSON.stringify(userData));
        navigate('/teacher/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Initial faculty setup failed');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Standard Faculty Login
    const res = await loginTeacher(email.trim(), password);
    setSubmitting(false);

    if (res.success) {
      navigate('/teacher/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-12 px-2 sm:px-0">
      <div className="bg-white border border-[#E2DFD7] p-5 sm:p-8 lg:p-10 shadow-2xs space-y-5 sm:space-y-6">
        <div className="text-center space-y-2.5 sm:space-y-3">
          <Logo size="lg" showText={false} className="justify-center mx-auto" />
          <h1 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#141719]">
            {needsInitialSetup ? 'Initial Faculty Setup' : 'Faculty Access'}
          </h1>
          <p className="text-xs text-[#697077] font-mono">
            {needsInitialSetup
              ? 'INITIALIZE MASTER FACULTY ADMINISTRATOR'
              : 'RESTRICTED TO AUTHORIZED FACULTY & EVALUATORS'}
          </p>
        </div>

        {needsInitialSetup && (
          <div className="p-3 bg-[#19323F] text-white border-l-2 border-[#C85A32] text-xs font-mono">
            <strong>System Notice:</strong> No faculty accounts exist in the database. Please initialize the master faculty account below. Once created, all future accounts must be enrolled from within the portal.
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-[#C85A32]/10 border border-[#C85A32] flex items-center space-x-2 text-xs font-mono text-[#C85A32]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {needsInitialSetup && (
            <>
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                  Faculty Administrator Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Prof. / Dr. Full Name"
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-sans text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                  Department / School
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science & Engineering"
                  value={setupDept}
                  onChange={(e) => setSetupDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-sans text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
              Faculty Institutional Email
            </label>
            <input
              type="email"
              required
              placeholder="faculty@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full finisterre-btn text-xs justify-center py-3.5 flex items-center"
          >
            <span>
              {submitting
                ? 'Authenticating...'
                : needsInitialSetup
                ? 'Initialize Master Faculty'
                : 'Sign In to Faculty Portal'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#E2DFD7] text-center">
          <p className="text-[11px] text-[#697077] font-mono leading-relaxed">
            New faculty evaluator accounts must be authorized and registered by existing faculty from inside the Faculty Portal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
