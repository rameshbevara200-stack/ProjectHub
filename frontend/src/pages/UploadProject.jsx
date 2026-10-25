import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Logo from '../components/Logo';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Compass,
} from 'lucide-react';

const UploadProject = () => {
  const { teamLeadData, verifyTeamLead, setTeamLeadData, logoutTeamLead } = useAuth();

  // Step 1: Verification form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState('');

  // Step 2: Submission form state
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [projectFileUrl, setProjectFileUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle Team Lead Login Verification
  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setAuthError('');

    const res = await verifyTeamLead(email.trim(), password);
    setVerifying(false);

    if (!res.success) {
      setAuthError(res.message);
    }
  };

  // Handle Project Submission
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await api.post('/projects/submit', {
        title,
        abstract,
        technologies,
        repoUrl,
        liveDemoUrl,
        projectFileUrl,
      });

      setSubmitSuccess(true);
      if (teamLeadData) {
        setTeamLeadData({ ...teamLeadData, isSubmitted: true });
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Error submitting project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Editorial Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 font-mono text-[11px] tracking-widest uppercase text-[#C85A32]">
          <Compass className="w-3.5 h-3.5" />
          <span>CAPSTONE SUBMISSION PROTOCOL</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#141719]">
          Project Dispatch Portal
        </h1>
        <p className="text-xs sm:text-sm text-[#697077] max-w-lg mx-auto font-light leading-relaxed">
          Authorized team leads may verify their credentials to submit the team’s final project and technical documentation. Submissions are strictly one-time only.
        </p>
      </div>

      {/* STEP 1: AUTHENTICATION / VERIFICATION FORM */}
      {!teamLeadData ? (
        <div className="bg-white border border-[#E2DFD7] p-8 sm:p-10 max-w-md mx-auto shadow-2xs">
          <div className="border-b border-[#E2DFD7] pb-4 mb-6 flex items-center space-x-3">
            <Logo size="sm" showText={false} />
            <div>
              <h2 className="font-display text-sm uppercase tracking-wider font-bold text-[#141719]">
                Step 01 / Team Lead Verification
              </h2>
              <p className="text-[11px] text-[#697077] font-mono">
                Provide credentials dispatched by your faculty instructor.
              </p>
            </div>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-[#C85A32]/10 border border-[#C85A32] flex items-start space-x-2 text-xs font-mono text-[#C85A32]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-bold">{authError}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                Team Lead Email
              </label>
              <input
                type="email"
                required
                placeholder="lead@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
              />
              <span className="text-[10px] text-[#9AA1A9] mt-1 block font-mono">
                Must match the exact address registered by your faculty member.
              </span>
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                Generated Access Password
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
              disabled={verifying}
              className="w-full finisterre-btn text-xs justify-center"
            >
              <span>{verifying ? 'Verifying Authorization...' : 'Authorize Submission'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </button>
          </form>

          <div className="pt-6 mt-6 border-t border-[#E2DFD7] text-center space-y-3">
            <span className="text-xs text-[#697077] block font-mono">
              New team? Haven't enrolled your capstone group yet?
            </span>
            <Link
              to="/register"
              className="finisterre-btn-rust text-xs w-full justify-center"
            >
              <span>Register New Student Team</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* STEP 2: VERIFIED AUTHORIZATION STATE */
        <div className="space-y-6">
          {/* Active Authorization Header */}
          <div className="bg-[#19323F] text-white p-5 sm:p-6 border border-[#141719] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#C85A32] flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-sm uppercase tracking-wider font-bold">
                  Authorized Team Lead: {teamLeadData.teamLead?.name}
                </h3>
                <p className="font-mono text-xs text-[#D4D8DD] mt-0.5">
                  TEAM: <strong>{teamLeadData.teamName}</strong> • {teamLeadData.year?.name || 'Cohort'} • SECTION {teamLeadData.section?.name || 'A'}
                </p>
              </div>
            </div>

            <button
              onClick={logoutTeamLead}
              className="font-mono text-xs text-[#D4D8DD] hover:text-white underline uppercase tracking-wider"
            >
              Exit Session
            </button>
          </div>

          {/* CHECK ONE-TIME SUBMISSION */}
          {teamLeadData.isSubmitted || submitSuccess ? (
            <div className="bg-white border border-[#E2DFD7] p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-[#141719] text-white flex items-center justify-center mx-auto">
                <FileCheck className="w-8 h-8 text-[#C85A32]" />
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#141719]">
                Submission Recorded & Locked
              </h2>
              <div className="max-w-md mx-auto p-4 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#697077]">
                <strong>STATUS:</strong> One-time submission protocol enforced. Your capstone assets have been securely stored in the academic catalogue.
              </div>
              <p className="text-xs text-[#697077] max-w-sm mx-auto font-light leading-relaxed">
                When faculty complete evaluation across all 4 rubrics, an official scorecard will be dispatched to <strong>{teamLeadData.teamLead?.email}</strong>.
              </p>
            </div>
          ) : (
            /* SUBMISSION FORM */
            <div className="bg-white border border-[#E2DFD7] p-6 sm:p-10 space-y-8">
              {submitError && (
                <div className="p-4 bg-[#C85A32]/10 border border-[#C85A32] text-xs font-mono text-[#C85A32]">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmitProject} className="space-y-6">
                {/* Pre-filled Information Spec Sheet */}
                <div className="bg-[#F8F7F4] border border-[#E2DFD7] p-5 space-y-3 font-mono text-xs">
                  <div className="font-display font-bold uppercase tracking-widest text-[#141719] text-[11px] pb-2 border-b border-[#E2DFD7]">
                    Pre-Registered Academic Roster
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[#9AA1A9] text-[10px] block">TEAM IDENTITY:</span>
                      <span className="font-bold text-[#141719]">{teamLeadData.teamName}</span>
                    </div>
                    <div>
                      <span className="text-[#9AA1A9] text-[10px] block">ASSIGNED LEAD:</span>
                      <span className="font-bold text-[#141719]">{teamLeadData.teamLead?.name}</span>
                    </div>
                  </div>

                  {teamLeadData.members && teamLeadData.members.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[#9AA1A9] text-[10px] block mb-1">CO-RESEARCHERS:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {teamLeadData.members.map((m, idx) => (
                          <span
                            key={idx}
                            className="bg-white border border-[#E2DFD7] px-2 py-0.5 text-[10px] text-[#484F56]"
                          >
                            {m.name} {m.rollNumber ? `(${m.rollNumber})` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submission Inputs */}
                <div className="space-y-5">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                      Project Title <span className="text-[#C85A32]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cold-Water Wave Energy Generation Algorithm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-sans text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                      Abstract & Methodology <span className="text-[#C85A32]">*</span>
                    </label>
                    <textarea
                      required
                      rows="4"
                      placeholder="Outline problem space, architecture, findings, and conclusion..."
                      value={abstract}
                      onChange={(e) => setAbstract(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-sans text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                      Applied Technologies (Comma Separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React, Express, MongoDB, Node.js, PyTorch"
                      value={technologies}
                      onChange={(e) => setTechnologies(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                        GitHub / Source Repository URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                        Live Demonstration / Hosted URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://prototype.app..."
                        value={liveDemoUrl}
                        onChange={(e) => setLiveDemoUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1 font-semibold">
                      Documentation File / Drive Attachment URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={projectFileUrl}
                      onChange={(e) => setProjectFileUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
                    />
                  </div>
                </div>

                {/* Final Warning */}
                <div className="p-4 bg-[#F8F7F4] border-l-2 border-[#C85A32] font-mono text-xs text-[#697077]">
                  <strong className="text-[#141719]">ONE-TIME SUBMISSION PROTOCOL:</strong> Confirm all repository links and technical attachments before final submission. This operation cannot be undone.
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full finisterre-btn-rust text-xs justify-center py-3"
                >
                  <UploadCloud className="w-4 h-4 mr-2" />
                  <span>{submitting ? 'Recording Submission...' : 'Execute Final Project Submission'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadProject;
