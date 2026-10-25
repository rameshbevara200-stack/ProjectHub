import React, { useState } from 'react';
import { X, Send, Award, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const RatingModal = ({ project, onClose, onRatingSubmitted }) => {
  const [scores, setScores] = useState({
    technicalApproach: 8,
    idea: 8,
    designThinking: 8,
    uiUx: 8,
  });
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleScoreChange = (field, value) => {
    setScores((prev) => ({
      ...prev,
      [field]: Math.max(0, Math.min(10, Number(value))),
    }));
  };

  const totalScore =
    Number(scores.technicalApproach) +
    Number(scores.idea) +
    Number(scores.designThinking) +
    Number(scores.uiUx);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post(`/projects/${project._id}/rate`, {
        technicalApproach: scores.technicalApproach,
        idea: scores.idea,
        designThinking: scores.designThinking,
        uiUx: scores.uiUx,
        feedback,
      });

      setSuccess(true);
      setTimeout(() => {
        onRatingSubmitted(res.data.project);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit evaluation');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#141719] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#697077] hover:text-[#141719] p-1 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-[#E2DFD7] pb-4 mb-5">
          <div className="flex items-center space-x-2 text-[#C85A32] font-mono text-xs uppercase tracking-widest">
            <Award className="w-4 h-4" />
            <span>Faculty Rubric Evaluation</span>
          </div>
          <h2 className="font-display text-xl font-bold uppercase tracking-tight text-[#141719] mt-1">
            "{project.title}"
          </h2>
          <p className="text-xs text-[#697077] font-mono mt-1">
            TEAM: <strong>{project.teamId?.teamName}</strong> • LEAD: {project.teamId?.teamLead?.email}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#C85A32]/10 border border-[#C85A32] font-mono text-xs text-[#C85A32]">
            {error}
          </div>
        )}

        {success ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#C85A32] mx-auto" />
            <h3 className="font-display text-lg font-bold uppercase text-[#141719]">
              Evaluation Dispatched
            </h3>
            <p className="text-xs text-[#697077] font-mono">
              Scorecard and feedback have been officially recorded and emailed to the team lead.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Criteria 1: Technical Approach */}
            <div>
              <div className="flex justify-between items-center font-mono text-xs uppercase tracking-wider text-[#141719] mb-1">
                <span>01. Technical Approach</span>
                <span className="font-bold text-[#C85A32]">{scores.technicalApproach} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={scores.technicalApproach}
                onChange={(e) => handleScoreChange('technicalApproach', e.target.value)}
                className="w-full h-1.5 bg-[#E2DFD7] appearance-none cursor-pointer accent-[#C85A32]"
              />
            </div>

            {/* Criteria 2: Idea & Innovation */}
            <div>
              <div className="flex justify-between items-center font-mono text-xs uppercase tracking-wider text-[#141719] mb-1">
                <span>02. Idea & Innovation</span>
                <span className="font-bold text-[#C85A32]">{scores.idea} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={scores.idea}
                onChange={(e) => handleScoreChange('idea', e.target.value)}
                className="w-full h-1.5 bg-[#E2DFD7] appearance-none cursor-pointer accent-[#C85A32]"
              />
            </div>

            {/* Criteria 3: Design Thinking */}
            <div>
              <div className="flex justify-between items-center font-mono text-xs uppercase tracking-wider text-[#141719] mb-1">
                <span>03. Design Thinking</span>
                <span className="font-bold text-[#C85A32]">{scores.designThinking} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={scores.designThinking}
                onChange={(e) => handleScoreChange('designThinking', e.target.value)}
                className="w-full h-1.5 bg-[#E2DFD7] appearance-none cursor-pointer accent-[#C85A32]"
              />
            </div>

            {/* Criteria 4: UI & UX */}
            <div>
              <div className="flex justify-between items-center font-mono text-xs uppercase tracking-wider text-[#141719] mb-1">
                <span>04. UI & UX</span>
                <span className="font-bold text-[#C85A32]">{scores.uiUx} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={scores.uiUx}
                onChange={(e) => handleScoreChange('uiUx', e.target.value)}
                className="w-full h-1.5 bg-[#E2DFD7] appearance-none cursor-pointer accent-[#C85A32]"
              />
            </div>

            {/* Score Aggregate Banner */}
            <div className="bg-[#141719] text-white p-3 flex justify-between items-center font-mono text-xs uppercase tracking-wider">
              <span className="text-[#D4D8DD]">Aggregate Score:</span>
              <span className="text-base font-bold text-[#C85A32]">{totalScore} / 40</span>
            </div>

            {/* Remarks */}
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#141719] mb-1">
                Faculty Remarks & Constructive Critique
              </label>
              <textarea
                rows="3"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Detail technical strengths, research methodology, and areas for refinement..."
                className="w-full p-3 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-sans text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
              ></textarea>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="finisterre-btn-outline text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="finisterre-btn-rust text-xs py-2 px-4"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                <span>{submitting ? 'Recording Score...' : 'Submit & Email Score'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RatingModal;
