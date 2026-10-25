import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  ArrowLeft,
  Calendar,
  Users,
  Award,
  Github,
  ExternalLink,
  FileText,
  UserCheck,
  CheckCircle2,
  Compass,
} from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (err) {
        setError('Project details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#141719] border-t-transparent animate-spin"></div>
        <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[#697077]">
          Loading Project Specification...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-white border border-[#E2DFD7] p-12 text-center max-w-lg mx-auto">
        <h3 className="font-display font-bold text-lg text-[#C85A32] uppercase">Specification Not Found</h3>
        <p className="text-xs text-[#697077] mt-2">{error || 'This project record does not exist or has been removed.'}</p>
        <Link
          to="/"
          className="finisterre-btn mt-6 text-xs inline-flex items-center space-x-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Showcase</span>
        </Link>
      </div>
    );
  }

  const { teamId, yearId, sectionId, evaluation } = project;
  const isRated = project.status === 'rated' && evaluation;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Editorial Breadcrumb */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 font-display text-xs font-bold uppercase tracking-wider text-[#697077] hover:text-[#141719] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Project Showcase</span>
        </Link>
      </div>

      {/* Main Specification Card */}
      <div className="bg-white border border-[#E2DFD7]">
        {/* Specification Header (Dark Slate/Ocean) */}
        <div className="bg-[#19323F] p-8 sm:p-12 text-white border-b border-[#141719]">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-wider bg-[#141719] text-[#EFECE6] px-3 py-1 border border-white/10">
              {yearId?.name || 'Cohort'}
            </span>
            <span className="font-mono text-xs uppercase tracking-wider bg-white/10 text-white px-3 py-1">
              SECTION {sectionId?.name || 'N/A'}
            </span>
            {isRated ? (
              <span className="font-mono text-xs uppercase tracking-wider bg-[#C85A32] text-white px-3 py-1 font-bold">
                EVALUATION SCORE: {evaluation.totalScore} / 40
              </span>
            ) : (
              <span className="font-mono text-xs uppercase tracking-wider bg-[#2C4C5E] text-[#D4D8DD] px-3 py-1">
                AWAITING FACULTY EVALUATION
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white leading-tight">
            {project.title}
          </h1>

          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs font-mono text-[#D4D8DD]">
            <div>
              <span className="text-white/50 block">TEAM:</span>
              <span className="text-white font-bold text-sm">{teamId?.teamName}</span>
            </div>
            <div>
              <span className="text-white/50 block">TEAM LEAD:</span>
              <span className="text-white font-semibold">{teamId?.teamLead?.name} ({teamId?.teamLead?.email})</span>
            </div>
            <div>
              <span className="text-white/50 block">CATALOGUE ID:</span>
              <span className="text-white/80">{project._id.slice(-8).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Specification Body */}
        <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Abstract */}
            <div>
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#141719] mb-3 pb-2 border-b border-[#E2DFD7]">
                01. Technical Abstract & Problem Statement
              </h2>
              <p className="text-sm text-[#484F56] leading-relaxed whitespace-pre-line font-light">
                {project.abstract}
              </p>
            </div>

            {/* Tech Stack Specs */}
            {project.technologies && project.technologies.length > 0 && (
              <div>
                <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#141719] mb-3 pb-2 border-b border-[#E2DFD7]">
                  02. Architecture & Applied Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-xs uppercase tracking-wider bg-[#F8F7F4] text-[#141719] border border-[#E2DFD7] px-3 py-1 font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables */}
            <div>
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[#141719] mb-3 pb-2 border-b border-[#E2DFD7]">
                03. Deliverables & Technical Assets
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 border border-[#E2DFD7] hover:border-[#141719] bg-[#F8F7F4] flex items-center justify-between group transition"
                  >
                    <div className="flex items-center space-x-2">
                      <Github className="w-5 h-5 text-[#141719]" />
                      <div className="text-left">
                        <span className="font-display text-xs font-bold uppercase block text-[#141719]">
                          GitHub Repository
                        </span>
                        <span className="font-mono text-[10px] text-[#697077]">View Source Code</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#697077] group-hover:text-[#141719]" />
                  </a>
                )}

                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 border border-[#C85A32] bg-[#C85A32]/5 flex items-center justify-between group transition"
                  >
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="w-5 h-5 text-[#C85A32]" />
                      <div className="text-left">
                        <span className="font-display text-xs font-bold uppercase block text-[#C85A32]">
                          Live Demonstration
                        </span>
                        <span className="font-mono text-[10px] text-[#C85A32]">Interactive Prototype</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#C85A32]" />
                  </a>
                )}

                {project.projectFileUrl && (
                  <a
                    href={project.projectFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 border border-[#E2DFD7] hover:border-[#141719] bg-[#F8F7F4] flex items-center justify-between group transition sm:col-span-2"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-[#141719]" />
                      <div className="text-left">
                        <span className="font-display text-xs font-bold uppercase block text-[#141719]">
                          Documentation & Technical Whitepaper
                        </span>
                        <span className="font-mono text-[10px] text-[#697077]">Cloud Document Attachment</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#697077] group-hover:text-[#141719]" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column: Team Roster & Scorecard */}
          <div className="space-y-8">
            {/* Team Roster */}
            <div className="border border-[#E2DFD7] p-5 bg-[#F8F7F4]">
              <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#141719] mb-4 flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#C85A32]" />
                <span>Team Roster</span>
              </h3>

              <div className="space-y-3">
                {/* Team Lead */}
                <div className="p-3 bg-white border border-[#E2DFD7]">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold uppercase text-[#141719]">
                      {teamId?.teamLead?.name}
                    </span>
                    <span className="font-mono text-[9px] bg-[#141719] text-white px-2 py-0.5 uppercase tracking-widest">
                      LEAD
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-[#697077] mt-1">
                    {teamId?.teamLead?.email}
                  </div>
                </div>

                {/* Team Members */}
                {teamId?.members && teamId.members.map((m, idx) => (
                  <div key={idx} className="p-3 bg-white border border-[#E2DFD7]">
                    <div className="font-display text-xs font-semibold text-[#141719]">
                      {m.name}
                    </div>
                    <div className="font-mono text-[10px] text-[#697077] mt-0.5">
                      {m.rollNumber ? `ID: ${m.rollNumber}` : 'Student Researcher'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty Evaluation Scorecard */}
            {isRated && (
              <div className="border border-[#141719] bg-[#141719] text-white p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2C3238] pb-3">
                  <h3 className="font-display text-xs font-bold uppercase tracking-widest text-[#EFECE6] flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-[#C85A32]" />
                    <span>Faculty Evaluation</span>
                  </h3>
                  <span className="font-mono text-xs font-bold text-[#C85A32]">
                    {evaluation.totalScore} / 40
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center bg-[#1F252A] p-2 border border-[#2C3238]">
                    <span className="text-[#9AA1A9]">Tech Approach:</span>
                    <span className="font-bold text-white">{evaluation.technicalApproach} / 10</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#1F252A] p-2 border border-[#2C3238]">
                    <span className="text-[#9AA1A9]">Idea & Innovation:</span>
                    <span className="font-bold text-white">{evaluation.idea} / 10</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#1F252A] p-2 border border-[#2C3238]">
                    <span className="text-[#9AA1A9]">Design Thinking:</span>
                    <span className="font-bold text-white">{evaluation.designThinking} / 10</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#1F252A] p-2 border border-[#2C3238]">
                    <span className="text-[#9AA1A9]">UI & UX:</span>
                    <span className="font-bold text-white">{evaluation.uiUx} / 10</span>
                  </div>
                </div>

                {evaluation.feedback && (
                  <div className="mt-4 pt-3 border-t border-[#2C3238]">
                    <div className="font-display text-[10px] uppercase tracking-widest text-[#C85A32] mb-1">
                      Faculty Remarks
                    </div>
                    <p className="text-xs text-[#D4D8DD] italic leading-relaxed font-sans">
                      "{evaluation.feedback}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
