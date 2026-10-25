import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Shield, Lock, Mail, ArrowRight, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState('');

  const { loginTeacher } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const res = await loginTeacher(email.trim(), password);
    setSubmitting(false);

    if (res.success) {
      navigate('/teacher/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleQuickSeed = async () => {
    setSeeding(true);
    setError('');
    try {
      const res = await api.post('/seed-teacher');
      setEmail(res.data.email);
      setPassword(res.data.password);
      setSeedNotice('Loaded demo faculty credentials: ' + res.data.email);
    } catch (err) {
      setError('Could not auto-seed teacher: ' + (err.response?.data?.message || err.message));
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white border border-[#E2DFD7] p-8 sm:p-10 shadow-2xs space-y-6">
        <div className="text-center space-y-3">
          <Logo size="lg" showText={false} className="justify-center mx-auto" />
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[#141719]">
            Faculty Access
          </h1>
          <p className="text-xs text-[#697077] font-mono">
            SECURE EVALUATION & ACADEMIC HIERARCHY CONTROLS
          </p>
        </div>

        {error && (
          <div className="p-4 bg-[#C85A32]/10 border border-[#C85A32] flex items-center space-x-2 text-xs font-mono text-[#C85A32]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {seedNotice && (
          <div className="p-3 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#19323F]">
            {seedNotice}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
              Faculty Email
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
            className="w-full finisterre-btn text-xs justify-center py-3"
          >
            <span>{submitting ? 'Verifying Faculty Credentials...' : 'Authenticate Faculty'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </button>
        </form>

        {/* Demo Seed Helper */}
        <div className="pt-4 border-t border-[#E2DFD7] text-center">
          <button
            type="button"
            onClick={handleQuickSeed}
            disabled={seeding}
            className="text-xs font-mono tracking-wider uppercase text-[#C85A32] hover:underline"
          >
            {seeding ? 'Generating Demo Faculty...' : 'Autofill Demo Faculty Credentials'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
