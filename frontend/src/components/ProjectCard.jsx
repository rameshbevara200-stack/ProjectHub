import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Users, ExternalLink, Github, Award, ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const isRated = project.status === 'rated' && project.evaluation;

  return (
    <article className="group bg-white border border-[#E2DFD7] hover:border-[#141719] transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Visual Top Bar / Blueprint Thumbnail */}
      <div className="relative h-44 bg-[#19323F] p-5 flex flex-col justify-between overflow-hidden text-white">
        {/* Top Badges */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center space-x-1.5 font-mono text-[11px] tracking-wider uppercase bg-[#141719]/80 backdrop-blur-xs px-2.5 py-1 border border-white/10 text-[#EFECE6]">
            <span>{project.yearId?.name || 'Year'}</span>
            <span className="text-[#C85A32]">/</span>
            <span>{project.sectionId?.name || 'Sec'}</span>
          </div>

          {isRated ? (
            <div className="flex items-center space-x-1 font-mono text-[11px] tracking-wider uppercase bg-[#C85A32] text-white px-2.5 py-1 font-bold">
              <Award className="w-3 h-3" />
              <span>{project.evaluation.totalScore}/40</span>
            </div>
          ) : (
            <div className="font-mono text-[10px] tracking-widest uppercase bg-[#2C4C5E] text-[#EFECE6] px-2 py-0.5 border border-white/10">
              PENDING EVAL
            </div>
          )}
        </div>

        {/* Thematic Abstract Graphic Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center font-mono text-5xl tracking-widest text-white select-none">
          /// ARCHIVE
        </div>

        {/* Team Meta at bottom of banner */}
        <div className="z-10 flex items-center justify-between text-xs text-[#EFECE6]/90 border-t border-white/10 pt-2 font-mono">
          <div className="flex items-center space-x-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-[#C85A32]" />
            <span className="font-semibold">{project.teamId?.teamName || 'Team'}</span>
          </div>
          <span className="text-[10px] text-white/60">
            Lead: {project.teamId?.teamLead?.name?.split(' ')[0] || 'Lead'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display font-bold text-lg text-[#141719] group-hover:text-[#C85A32] transition-colors leading-snug line-clamp-2">
          <Link to={`/project/${project._id}`}>{project.title}</Link>
        </h3>

        <p className="mt-3 text-xs text-[#697077] leading-relaxed line-clamp-3">
          {project.abstract}
        </p>

        {/* Technology Badges (Material / Spec style) */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#EFECE6] flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="font-mono text-[10px] uppercase tracking-wider bg-[#F8F7F4] text-[#484F56] border border-[#E2DFD7] px-2 py-0.5"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="font-mono text-[10px] text-[#9AA1A9] py-0.5">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer / Actions */}
      <div className="px-6 py-4 bg-[#F8F7F4] border-t border-[#E2DFD7] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-[#697077] hover:text-[#141719] transition"
              title="Source Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-[#697077] hover:text-[#C85A32] transition"
              title="Live Prototype"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <Link
          to={`/project/${project._id}`}
          className="font-display text-xs font-bold uppercase tracking-wider text-[#141719] group-hover:text-[#C85A32] inline-flex items-center space-x-1"
        >
          <span>Explore Spec</span>
          <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default ProjectCard;
