import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import api from '../services/api';
import { Shield, Lock, Mail, User, Building, ArrowRight, AlertTriangle } from 'lucide-react';

const TeacherLogin = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { loginTeacher } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (isRegistering) {
      // Faculty Account Registration
      try {
        const res = await api.post('/auth/teacher/register', {
          name: name.trim(),
          email: email.trim(),
          password,
          department: department.trim() || 'Computer Science & Engineering',
        });
        const { token, ...userData } = res.data;
        localStorage.setItem('teacherToken', token);
        localStorage.setItem('teacherUser', JSON.stringify(userData));
        navigate('/teacher/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Faculty registration failed');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Faculty Login
      const res = await loginTeacher(email.trim(), password);
      setSubmitting(false);

      if (res.success) {
        navigate('/teacher/dashboard');
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white border border-[#E2DFD7] p-8 sm:p-10 shadow-2xs space-y-6">
        <div className="text-center space-y-3">
          <Logo size="lg" showText={false} className="justify-center mx-auto" />
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[#141719]">
            {isRegistering ? 'Faculty Registration' : 'Faculty Access'}
          </h1>
          <p className="text-xs text-[#697077] font-mono">
            {isRegistering
              ? 'CREATE AN AUTHORIZED FACULTY EVALUATOR ACCOUNT'
              : 'SECURE EVALUATION & ACADEMIC HIERARCHY CONTROLS'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-[#C85A32]/10 border border-[#C85A32] flex items-center space-x-2 text-xs font-mono text-[#C85A32]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                  Faculty Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Prof. / Dr. Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-sans text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                  Department / Faculty Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science & Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-sans text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                />
              </div>
            </>
          )}

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
            <span>
              {submitting
                ? 'Processing...'
                : isRegistering
                ? 'Register Faculty Account'
                : 'Authenticate Faculty'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </button>
        </form>

        {/* Toggle between Login and Registration */}
        <div className="pt-4 border-t border-[#E2DFD7] text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-xs font-mono tracking-wider uppercase text-[#C85A32] hover:underline"
          >
            {isRegistering
              ? '← Already have an account? Sign In'
              : 'New Faculty? Create an Evaluator Account →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
