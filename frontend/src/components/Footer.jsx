import React from 'react';
import Logo from './Logo';
import { ShieldCheck, Award, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#141719] text-[#EFECE6] border-t border-black mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2C3238]">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="sm" variant="light" />
            <p className="text-xs text-[#9AA1A9] leading-relaxed">
              Built with purpose and integrity. A rugged, resilient academic archive documenting research, technical architecture, and capstone engineering across all cohorts.
            </p>
            <div className="pt-2">
              <span className="inline-block border border-[#C85A32]/60 px-2.5 py-1 text-[10px] font-mono tracking-widest text-[#EFECE6] uppercase">
                Academic Integrity & Transparency
              </span>
            </div>
          </div>

          {/* Flow Architecture */}
          <div className="space-y-3">
            <h4 className="font-display text-xs uppercase tracking-widest text-white font-semibold">
              Hierarchical Architecture
            </h4>
            <ul className="text-xs text-[#9AA1A9] space-y-2 font-mono">
              <li className="flex items-center space-x-2">
                <span className="text-[#C85A32]">01.</span>
                <span>Academic Cohort (Year)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#C85A32]">02.</span>
                <span>Branch / Section</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#C85A32]">03.</span>
                <span>Student Team Roster</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-[#C85A32]">04.</span>
                <span>Designated Team Lead</span>
              </li>
            </ul>
          </div>

          {/* Submission Protocol */}
          <div className="space-y-3">
            <h4 className="font-display text-xs uppercase tracking-widest text-white font-semibold">
              Evaluation Standards
            </h4>
            <p className="text-xs text-[#9AA1A9] leading-relaxed">
              Every submission is rigorously rated across four core faculty vectors:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#D4D8DD]">
              <span className="bg-[#1F252A] p-1.5 border border-[#2C3238]">• Tech Approach</span>
              <span className="bg-[#1F252A] p-1.5 border border-[#2C3238]">• Innovation</span>
              <span className="bg-[#1F252A] p-1.5 border border-[#2C3238]">• Design Thinking</span>
              <span className="bg-[#1F252A] p-1.5 border border-[#2C3238]">• UI & UX</span>
            </div>
          </div>

          {/* Faculty Protocol */}
          <div className="space-y-3">
            <h4 className="font-display text-xs uppercase tracking-widest text-white font-semibold">
              Strict Protocols
            </h4>
            <p className="text-xs text-[#9AA1A9] leading-relaxed">
              Teams are granted a <strong>single one-time upload</strong>. Submissions lock immediately upon delivery to ensure academic accountability.
            </p>
            <div className="text-xs font-mono text-[#C85A32]">
              Automated Scorecard Dispatch Enabled
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#697077] gap-4">
          <p>© {new Date().getFullYear()} College Project Hub. Inspired by Finisterre’s functional maritime design ethos.</p>
          <div className="flex space-x-6 text-[11px] tracking-wider uppercase font-mono">
            <span>Security & Verifiability</span>
            <span>•</span>
            <span>Cascade Deletes</span>
            <span>•</span>
            <span>MERN Stack</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
