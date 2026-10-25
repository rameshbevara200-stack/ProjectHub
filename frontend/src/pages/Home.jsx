import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import { Search, Compass, Layers, ArrowDown, ArrowUpRight, Filter } from 'lucide-react';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [years, setYears] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Years and Sections for filter selectors
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [yearRes, sectionRes] = await Promise.all([
          api.get('/academic/years'),
          api.get('/academic/sections'),
        ]);
        setYears(yearRes.data);
        setSections(sectionRes.data);
      } catch (err) {
        console.error('Error fetching academic filters:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Projects based on filters
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedYear) params.yearId = selectedYear;
        if (selectedSection) params.sectionId = selectedSection;
        if (searchQuery) params.search = searchQuery;

        const res = await api.get('/projects', { params });
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchProjects();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [selectedYear, selectedSection, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Editorial Hero Banner (Finisterre Cold-Water Maritime Style) */}
      <section className="relative bg-[#19323F] text-white p-8 sm:p-16 lg:p-20 overflow-hidden border border-[#141719]">
        {/* Subtle grid contour background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#EFECE6]/80 uppercase">
            <span className="w-2 h-2 bg-[#C85A32]"></span>
            <span>ACADEMIC ARCHIVE • CAPSTONE RESEARCH & ENGINEERING</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-[1.08] uppercase text-[#F8F7F4]">
            Engineered with Purpose. <br />
            <span className="text-[#C85A32]">Built for Resilience.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#D4D8DD] font-sans leading-relaxed max-w-2xl font-light">
            A centralized digital commons combining all student projects across disciplines. Explore validated technical architectures, innovative prototypes, and capstone breakthroughs evaluated by faculty.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <a href="#showcase" className="finisterre-btn-rust">
              Explore Repository
            </a>
            <Link to="/register" className="finisterre-btn-outline !text-white !border-white hover:!bg-white hover:!text-[#141719]">
              Register Your Team
            </Link>
            <Link to="/upload" className="text-xs font-mono uppercase tracking-wider text-[#D4D8DD] hover:text-white underline ml-1">
              Submit Deliverables →
            </Link>
          </div>
        </div>

        {/* Minimalist Topographical Watermark / Coordinates */}
        <div className="hidden lg:block absolute bottom-8 right-12 text-right font-mono text-[11px] text-white/40 tracking-widest uppercase">
          <div>FLOW: YEAR → SECTION → TEAM → LEAD</div>
          <div>50.3129° N, 5.2036° W // ARCHIVE VERIFIED</div>
        </div>
      </section>

      {/* Filter & Search Bar (Finisterre Filter Drawer Style) */}
      <section id="showcase" className="bg-white border border-[#E2DFD7] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#697077]" />
            <input
              type="text"
              placeholder="Search by keywords, technical stack, or abstract..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-sans text-[#141719] placeholder-[#9AA1A9] focus:outline-hidden focus:border-[#141719]"
            />
          </div>

          {/* Academic Selectors */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center">
            <div className="w-full sm:w-56">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSelectedSection('');
                }}
                className="w-full py-2.5 px-3 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono uppercase tracking-wider text-[#141719] focus:outline-hidden focus:border-[#141719]"
              >
                <option value="">All Academic Years</option>
                {years.map((y) => (
                  <option key={y._id} value={y._id}>
                    {y.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-52">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono uppercase tracking-wider text-[#141719] focus:outline-hidden focus:border-[#141719]"
              >
                <option value="">All Branches / Sections</option>
                {sections
                  .filter((s) => !selectedYear || s.yearId?._id === selectedYear || s.yearId === selectedYear)
                  .map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>

            {(selectedYear || selectedSection || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedYear('');
                  setSelectedSection('');
                  setSearchQuery('');
                }}
                className="text-[11px] font-mono tracking-wider uppercase text-[#C85A32] hover:underline px-2 whitespace-nowrap"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Counter Sub-bar */}
        <div className="mt-4 pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs font-mono text-[#697077]">
          <span>
            CATALOGUE: <strong>{projects.length}</strong> ENTRIES FOUND
          </span>
          <span className="hidden sm:inline">
            CRITERIA: TECHNICAL APPROACH • INNOVATION • DESIGN • UX
          </span>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E2DFD7] h-80 animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="h-32 bg-[#EFECE6] mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-[#EFECE6] w-3/4"></div>
                  <div className="h-3 bg-[#EFECE6] w-full"></div>
                  <div className="h-3 bg-[#EFECE6] w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-[#E2DFD7] p-16 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 bg-[#F8F7F4] border border-[#E2DFD7] flex items-center justify-center mx-auto text-[#697077]">
              <Compass className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-[#141719]">
              No Projects Matched
            </h3>
            <p className="text-xs text-[#697077] leading-relaxed">
              We couldn't locate any projects matching your academic year or branch criteria. Try resetting filters or submit a new project.
            </p>
            <div className="pt-2">
              <Link to="/upload" className="finisterre-btn text-xs">
                Submit Project Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
