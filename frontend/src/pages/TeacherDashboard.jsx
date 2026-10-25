import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import RatingModal from '../components/RatingModal';
import ConfirmModal from '../components/ConfirmModal';
import {
  Layers,
  Clock,
  HelpCircle,
  Award,
  KeyRound,
  Plus,
  Trash2,
  ExternalLink,
  Github,
  Star,
  RefreshCw,
  FolderTree,
  Users,
  Compass,
} from 'lucide-react';

const TeacherDashboard = () => {
  const { teacher } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'all', 'pending', 'unrated', 'rated', 'leads', 'academic'
  const [activeTab, setActiveTab] = useState('all');

  // Metadata filters
  const [years, setYears] = useState([]);
  const [sections, setSections] = useState([]);
  const [filterYear, setFilterYear] = useState('');
  const [filterSection, setFilterSection] = useState('');

  // Data states
  const [allProjects, setAllProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [unratedProjects, setUnratedProjects] = useState([]);
  const [ratedProjects, setRatedProjects] = useState([]);
  const [teamLeadsData, setTeamLeadsData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  // Rating Modal state
  const [ratingTarget, setRatingTarget] = useState(null);

  // Delete Confirmation Modal state
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    type: '',
    id: null,
    name: '',
    warningNote: '',
    loading: false,
  });

  // Academic Management Forms state
  const [newYearName, setNewYearName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionYearId, setNewSectionYearId] = useState('');

  const [newTeam, setNewTeam] = useState({
    teamName: '',
    description: '',
    yearId: '',
    sectionId: '',
    leadName: '',
    leadEmail: '',
    membersText: '',
  });
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  // Guard: Redirect to login if not logged in
  useEffect(() => {
    if (!teacher) {
      navigate('/teacher/login');
    }
  }, [teacher, navigate]);

  // Load Metadata
  const fetchMetadata = async () => {
    try {
      const [yrRes, secRes] = await Promise.all([
        api.get('/academic/years'),
        api.get('/academic/sections'),
      ]);
      setYears(yrRes.data);
      setSections(secRes.data);
    } catch (err) {
      console.error('Failed to load academic metadata', err);
    }
  };

  useEffect(() => {
    if (teacher) {
      fetchMetadata();
    }
  }, [teacher]);

  // Fetch data depending on activeTab and filters
  const loadTabData = async () => {
    setLoading(true);
    const params = {};
    if (filterYear) params.yearId = filterYear;
    if (filterSection) params.sectionId = filterSection;

    try {
      if (activeTab === 'all') {
        const res = await api.get('/projects/teacher/all', { params });
        setAllProjects(res.data);
      } else if (activeTab === 'pending') {
        const res = await api.get('/projects/teacher/pending', { params });
        setPendingProjects(res.data);
      } else if (activeTab === 'unrated') {
        const res = await api.get('/projects/teacher/unrated', { params });
        setUnratedProjects(res.data);
      } else if (activeTab === 'rated') {
        const res = await api.get('/projects/teacher/rated', { params });
        setRatedProjects(res.data);
      } else if (activeTab === 'leads') {
        const res = await api.get('/academic/team-leads', { params });
        setTeamLeadsData(res.data);
      } else if (activeTab === 'academic') {
        const [yrRes, secRes, tmRes] = await Promise.all([
          api.get('/academic/years'),
          api.get('/academic/sections'),
          api.get('/academic/teams', { params }),
        ]);
        setYears(yrRes.data);
        setSections(secRes.data);
        setTeams(tmRes.data);
      }
    } catch (err) {
      console.error('Error fetching tab data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacher) {
      loadTabData();
    }
  }, [activeTab, filterYear, filterSection]);

  // Academic Creation: Year
  const handleCreateYear = async (e) => {
    e.preventDefault();
    if (!newYearName.trim()) return;
    try {
      await api.post('/academic/years', { name: newYearName });
      setNewYearName('');
      setFormMsg({ type: 'success', text: 'Academic Cohort (Year) created successfully.' });
      fetchMetadata();
      loadTabData();
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create year' });
    }
  };

  // Academic Creation: Section
  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!newSectionName.trim() || !newSectionYearId) return;
    try {
      await api.post('/academic/sections', {
        name: newSectionName,
        yearId: newSectionYearId,
      });
      setNewSectionName('');
      setFormMsg({ type: 'success', text: 'Section / Branch added to cohort.' });
      fetchMetadata();
      loadTabData();
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create section' });
    }
  };

  // Academic Creation: Team & Team Lead
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });

    const members = newTeam.membersText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(',');
        return {
          name: parts[0]?.trim() || line,
          rollNumber: parts[1]?.trim() || '',
        };
      });

    try {
      const res = await api.post('/academic/teams', {
        teamName: newTeam.teamName,
        description: newTeam.description,
        yearId: newTeam.yearId,
        sectionId: newTeam.sectionId,
        leadName: newTeam.leadName,
        leadEmail: newTeam.leadEmail,
        members,
      });

      setFormMsg({
        type: res.data.emailStatus?.success ? 'success' : 'warning',
        text: res.data.message || 'Team registered successfully!',
      });

      setNewTeam({
        teamName: '',
        description: '',
        yearId: newTeam.yearId,
        sectionId: newTeam.sectionId,
        leadName: '',
        leadEmail: '',
        membersText: '',
      });
      loadTabData();
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create team' });
    }
  };

  // Trigger Deletion Confirmation Modal
  const requestDelete = (type, item) => {
    let warningNote = '';
    let itemName = '';

    if (type === 'year') {
      itemName = `Academic Year "${item.name}"`;
      warningNote =
        'Deleting this Year will trigger an automatic cascade, deleting all child Sections, Teams, Team Leads, and Project Submissions within it.';
    } else if (type === 'section') {
      itemName = `Section "${item.name}"`;
      warningNote =
        'Deleting this Section will cascade and permanently delete all Teams, Team Leads, and Project Submissions inside it.';
    } else if (type === 'team') {
      itemName = `Team "${item.teamName}"`;
      warningNote =
        'Deleting this Team will permanently remove the Team Lead credentials and all associated project submissions.';
    }

    setConfirmDelete({
      isOpen: true,
      type,
      id: item._id,
      name: itemName,
      warningNote,
      loading: false,
    });
  };

  // Execute Cascading Delete
  const handleExecuteDelete = async () => {
    setConfirmDelete((prev) => ({ ...prev, loading: true }));
    try {
      if (confirmDelete.type === 'year') {
        await api.delete(`/academic/years/${confirmDelete.id}`);
      } else if (confirmDelete.type === 'section') {
        await api.delete(`/academic/sections/${confirmDelete.id}`);
      } else if (confirmDelete.type === 'team') {
        await api.delete(`/academic/teams/${confirmDelete.id}`);
      }

      setConfirmDelete({ isOpen: false, type: '', id: null, name: '', warningNote: '', loading: false });
      fetchMetadata();
      loadTabData();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
      setConfirmDelete((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner (Finisterre Deep Slate & Maritime Rust) */}
      <div className="bg-[#19323F] text-white p-6 sm:p-10 border border-[#141719] flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="font-mono text-xs uppercase tracking-widest text-[#C85A32]">
            FACULTY CONTROL CENTER • EVALUATION PROTOCOLS
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
            {teacher?.name}
          </h1>
          <p className="font-mono text-xs text-[#D4D8DD]">
            {teacher?.department} • CORNWALL ACADEMIC COMMONS
          </p>
        </div>

        <button
          onClick={loadTabData}
          className="finisterre-btn-outline !text-white !border-white hover:!bg-white hover:!text-[#141719] text-xs py-2 px-4 inline-flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          <span>Synchronize Records</span>
        </button>
      </div>

      {/* Tabs Navigation (Finisterre Segmented Control) */}
      <div className="bg-white border border-[#E2DFD7] p-2 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {[
            { id: 'all', label: 'All Projects', icon: Layers },
            { id: 'pending', label: 'Pending Projects', icon: Clock },
            { id: 'unrated', label: 'Unrated Submissions', icon: HelpCircle },
            { id: 'rated', label: 'Rated Archive', icon: Award },
            { id: 'leads', label: 'Team Lead Directory', icon: KeyRound },
            { id: 'academic', label: 'Academic Hierarchy', icon: FolderTree },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 font-display text-xs uppercase tracking-wider font-semibold transition ${
                  isSelected
                    ? 'bg-[#141719] text-white'
                    : 'text-[#697077] hover:text-[#141719] hover:bg-[#F8F7F4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      {activeTab !== 'academic' && (
        <div className="bg-white p-4 border border-[#E2DFD7] flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#141719]">Filter by:</span>
          <select
            value={filterYear}
            onChange={(e) => {
              setFilterYear(e.target.value);
              setFilterSection('');
            }}
            className="py-1.5 px-3 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono uppercase tracking-wider text-[#141719]"
          >
            <option value="">All Academic Years</option>
            {years.map((y) => (
              <option key={y._id} value={y._id}>
                {y.name}
              </option>
            ))}
          </select>

          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="py-1.5 px-3 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono uppercase tracking-wider text-[#141719]"
          >
            <option value="">All Sections / Branches</option>
            {sections
              .filter((s) => !filterYear || s.yearId?._id === filterYear || s.yearId === filterYear)
              .map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* TAB 1: ALL PROJECTS */}
      {activeTab === 'all' && (
        <div className="bg-white border border-[#E2DFD7] overflow-hidden">
          <div className="p-5 border-b border-[#E2DFD7] flex justify-between items-center bg-[#F8F7F4]">
            <h2 className="font-display text-xs uppercase tracking-widest font-bold text-[#141719]">
              All Submitted Projects ({allProjects.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-[#484F56]">
              <thead className="bg-[#F8F7F4] text-[10px] uppercase font-bold tracking-widest text-[#697077] border-b border-[#E2DFD7]">
                <tr>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Team</th>
                  <th className="p-4">Academic Year</th>
                  <th className="p-4">Section</th>
                  <th className="p-4">Evaluation Status</th>
                  <th className="p-4 text-right">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DFD7]">
                {allProjects.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F8F7F4]/80">
                    <td className="p-4 font-bold text-[#141719] font-sans text-sm">{p.title}</td>
                    <td className="p-4">{p.teamId?.teamName}</td>
                    <td className="p-4">{p.yearId?.name}</td>
                    <td className="p-4">{p.sectionId?.name}</td>
                    <td className="p-4">
                      {p.status === 'rated' ? (
                        <span className="px-2 py-0.5 bg-[#C85A32] text-white font-bold">
                          RATED: {p.evaluation?.totalScore}/40
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#EFECE6] text-[#484F56] border border-[#E2DFD7]">
                          UNRATED
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {p.repoUrl && (
                        <a href={p.repoUrl} target="_blank" rel="noreferrer" className="inline-block p-1 text-[#697077] hover:text-[#141719]">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {p.liveDemoUrl && (
                        <a href={p.liveDemoUrl} target="_blank" rel="noreferrer" className="inline-block p-1 text-[#C85A32] hover:text-[#B34A24]">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
                {allProjects.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-[#9AA1A9]">
                      No projects recorded in the catalogue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PENDING PROJECTS */}
      {activeTab === 'pending' && (
        <div className="bg-white border border-[#E2DFD7] overflow-hidden">
          <div className="p-5 border-b border-[#E2DFD7] bg-[#F8F7F4]">
            <h2 className="font-display text-xs uppercase tracking-widest font-bold text-[#141719]">
              Pending Submissions ({pendingProjects.length})
            </h2>
            <p className="text-[11px] text-[#697077] mt-1 font-mono">
              Teams registered by faculty whose designated team lead has not executed final submission.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-[#484F56]">
              <thead className="bg-[#F8F7F4] text-[10px] uppercase font-bold tracking-widest text-[#697077] border-b border-[#E2DFD7]">
                <tr>
                  <th className="p-4">Team Name</th>
                  <th className="p-4">Assigned Team Lead</th>
                  <th className="p-4">Contact Email</th>
                  <th className="p-4">Cohort</th>
                  <th className="p-4">Section</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DFD7]">
                {pendingProjects.map((t) => (
                  <tr key={t._id} className="hover:bg-[#F8F7F4]/80">
                    <td className="p-4 font-bold text-[#141719] font-sans text-sm">{t.teamName}</td>
                    <td className="p-4">{t.teamLead?.name}</td>
                    <td className="p-4 text-[#C85A32]">{t.teamLead?.email}</td>
                    <td className="p-4">{t.yearId?.name}</td>
                    <td className="p-4">{t.sectionId?.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-[#EFECE6] text-[#697077] border border-[#E2DFD7]">
                        Awaiting Lead Upload
                      </span>
                    </td>
                  </tr>
                ))}
                {pendingProjects.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-[#9AA1A9]">
                      All registered teams have completed their submissions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: UNRATED PROJECTS */}
      {activeTab === 'unrated' && (
        <div className="bg-white border border-[#E2DFD7] overflow-hidden">
          <div className="p-5 border-b border-[#E2DFD7] bg-[#F8F7F4]">
            <h2 className="font-display text-xs uppercase tracking-widest font-bold text-[#141719]">
              Unrated Project Submissions ({unratedProjects.length})
            </h2>
            <p className="text-[11px] text-[#697077] mt-1 font-mono">
              Awaiting faculty assessment. Completing evaluation automatically triggers an official scorecard email to the team lead.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-[#484F56]">
              <thead className="bg-[#F8F7F4] text-[10px] uppercase font-bold tracking-widest text-[#697077] border-b border-[#E2DFD7]">
                <tr>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Team & Lead</th>
                  <th className="p-4">Cohort / Section</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4 text-right">Faculty Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DFD7]">
                {unratedProjects.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F8F7F4]/80">
                    <td className="p-4 font-bold text-[#141719] font-sans text-sm">{p.title}</td>
                    <td className="p-4">
                      {p.teamId?.teamName}
                      <span className="text-[10px] text-[#9AA1A9] block">
                        Lead: {p.teamId?.teamLead?.email}
                      </span>
                    </td>
                    <td className="p-4">
                      {p.yearId?.name} • {p.sectionId?.name}
                    </td>
                    <td className="p-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setRatingTarget(p)}
                        className="finisterre-btn-rust text-xs py-1.5 px-3"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        <span>Rate Project</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {unratedProjects.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-[#9AA1A9]">
                      No unrated submissions pending evaluation.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RATED PROJECTS */}
      {activeTab === 'rated' && (
        <div className="bg-white border border-[#E2DFD7] overflow-hidden">
          <div className="p-5 border-b border-[#E2DFD7] bg-[#F8F7F4]">
            <h2 className="font-display text-xs uppercase tracking-widest font-bold text-[#141719]">
              Evaluated & Rated Archive ({ratedProjects.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-[#484F56]">
              <thead className="bg-[#F8F7F4] text-[10px] uppercase font-bold tracking-widest text-[#697077] border-b border-[#E2DFD7]">
                <tr>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Team</th>
                  <th className="p-4">Tech Approach</th>
                  <th className="p-4">Idea</th>
                  <th className="p-4">Design Thinking</th>
                  <th className="p-4">UI & UX</th>
                  <th className="p-4">Total Score</th>
                  <th className="p-4 text-right">Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DFD7]">
                {ratedProjects.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F8F7F4]/80">
                    <td className="p-4 font-bold text-[#141719] font-sans text-sm">{p.title}</td>
                    <td className="p-4">{p.teamId?.teamName}</td>
                    <td className="p-4 font-bold">{p.evaluation?.technicalApproach}/10</td>
                    <td className="p-4 font-bold">{p.evaluation?.idea}/10</td>
                    <td className="p-4 font-bold">{p.evaluation?.designThinking}/10</td>
                    <td className="p-4 font-bold">{p.evaluation?.uiUx}/10</td>
                    <td className="p-4 font-bold text-[#C85A32] text-sm">
                      {p.evaluation?.totalScore} / 40
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setRatingTarget(p)}
                        className="finisterre-btn-outline text-xs py-1 px-2.5"
                      >
                        Adjust Score
                      </button>
                    </td>
                  </tr>
                ))}
                {ratedProjects.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-10 text-center text-[#9AA1A9]">
                      No evaluated projects recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: TEAM LEAD DATA (YEAR-WISE) */}
      {activeTab === 'leads' && (
        <div className="bg-white border border-[#E2DFD7] overflow-hidden">
          <div className="p-5 border-b border-[#E2DFD7] bg-[#F8F7F4]">
            <h2 className="font-display text-xs uppercase tracking-widest font-bold text-[#141719]">
              Team Lead Directory & Generated Credentials ({teamLeadsData.length})
            </h2>
            <p className="text-[11px] text-[#697077] mt-1 font-mono">
              Faculty reference directory of auto-generated login credentials organized year-wise.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-[#484F56]">
              <thead className="bg-[#F8F7F4] text-[10px] uppercase font-bold tracking-widest text-[#697077] border-b border-[#E2DFD7]">
                <tr>
                  <th className="p-4">Cohort (Year)</th>
                  <th className="p-4">Section</th>
                  <th className="p-4">Team</th>
                  <th className="p-4">Lead Name</th>
                  <th className="p-4">Login Email</th>
                  <th className="p-4">Generated Password</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DFD7]">
                {teamLeadsData.map((lead) => (
                  <tr key={lead._id} className="hover:bg-[#F8F7F4]/80">
                    <td className="p-4 font-bold text-[#141719]">{lead.year}</td>
                    <td className="p-4">{lead.section}</td>
                    <td className="p-4 font-sans font-semibold text-[#141719]">{lead.teamName}</td>
                    <td className="p-4">{lead.leadName}</td>
                    <td className="p-4 text-[#19323F] font-bold">{lead.leadEmail}</td>
                    <td className="p-4">
                      <span className="bg-[#141719] text-[#EFECE6] px-2 py-0.5 font-bold">
                        {lead.credentials}
                      </span>
                    </td>
                    <td className="p-4">
                      {lead.isSubmitted ? (
                        <span className="text-[#C85A32] font-bold">SUBMITTED</span>
                      ) : (
                        <span className="text-[#9AA1A9]">PENDING</span>
                      )}
                    </td>
                  </tr>
                ))}
                {teamLeadsData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-[#9AA1A9]">
                      No team leads registered for this cohort.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: ACADEMIC HIERARCHY MANAGEMENT & CASCADING DELETIONS */}
      {activeTab === 'academic' && (
        <div className="space-y-10">
          {formMsg.text && (
            <div
              className={`p-4 border font-mono text-xs ${
                formMsg.type === 'success'
                  ? 'bg-[#F8F7F4] border-[#141719] text-[#141719]'
                  : formMsg.type === 'warning'
                  ? 'bg-[#EFECE6] border-l-4 border-[#C85A32] text-[#141719]'
                  : 'bg-[#C85A32]/10 border-[#C85A32] text-[#C85A32]'
              }`}
            >
              {formMsg.text}
            </div>
          )}

          {/* Creation Forms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Year */}
            <div className="bg-white border border-[#E2DFD7] p-6 space-y-4">
              <h3 className="font-display text-xs uppercase tracking-widest font-bold text-[#141719] flex items-center space-x-2">
                <Plus className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>01. Add Academic Year (Cohort)</span>
              </h3>
              <form onSubmit={handleCreateYear} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. 2024-2025"
                  value={newYearName}
                  onChange={(e) => setNewYearName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#141719] focus:outline-hidden focus:border-[#141719]"
                />
                <button type="submit" className="w-full finisterre-btn text-xs py-2">
                  Create Year
                </button>
              </form>
            </div>

            {/* Create Section */}
            <div className="bg-white border border-[#E2DFD7] p-6 space-y-4">
              <h3 className="font-display text-xs uppercase tracking-widest font-bold text-[#141719] flex items-center space-x-2">
                <Plus className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>02. Add Section / Branch</span>
              </h3>
              <form onSubmit={handleCreateSection} className="space-y-3">
                <select
                  required
                  value={newSectionYearId}
                  onChange={(e) => setNewSectionYearId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono uppercase tracking-wider text-[#141719] focus:outline-hidden focus:border-[#141719]"
                >
                  <option value="">Select Academic Year</option>
                  {years.map((y) => (
                    <option key={y._id} value={y._id}>
                      {y.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  required
                  placeholder="e.g. CSE-A or ECE-B"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono text-[#141719] focus:outline-hidden focus:border-[#141719]"
                />

                <button type="submit" className="w-full finisterre-btn text-xs py-2">
                  Create Section
                </button>
              </form>
            </div>

            {/* Create Team & Team Lead */}
            <div className="bg-white border border-[#E2DFD7] p-6 space-y-4">
              <h3 className="font-display text-xs uppercase tracking-widest font-bold text-[#141719] flex items-center space-x-2">
                <Plus className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>03. Add Team & Team Lead</span>
              </h3>
              <form onSubmit={handleCreateTeam} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    required
                    value={newTeam.yearId}
                    onChange={(e) => setNewTeam({ ...newTeam, yearId: e.target.value, sectionId: '' })}
                    className="w-full px-2 py-1.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono"
                  >
                    <option value="">Cohort</option>
                    {years.map((y) => (
                      <option key={y._id} value={y._id}>
                        {y.name}
                      </option>
                    ))}
                  </select>

                  <select
                    required
                    value={newTeam.sectionId}
                    onChange={(e) => setNewTeam({ ...newTeam, sectionId: e.target.value })}
                    className="w-full px-2 py-1.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono"
                  >
                    <option value="">Section</option>
                    {sections
                      .filter((s) => !newTeam.yearId || s.yearId?._id === newTeam.yearId || s.yearId === newTeam.yearId)
                      .map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Team Name (e.g. WaveRiders)"
                  value={newTeam.teamName}
                  onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono"
                />

                <input
                  type="text"
                  placeholder="Project Theme"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Lead Full Name"
                    value={newTeam.leadName}
                    onChange={(e) => setNewTeam({ ...newTeam, leadName: e.target.value })}
                    className="w-full px-2 py-1.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Lead Email (Auth)"
                    value={newTeam.leadEmail}
                    onChange={(e) => setNewTeam({ ...newTeam, leadEmail: e.target.value })}
                    className="w-full px-2 py-1.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono"
                  />
                </div>

                <textarea
                  rows="2"
                  placeholder="Members (one per line, e.g: John Doe, 21CSE001)"
                  value={newTeam.membersText}
                  onChange={(e) => setNewTeam({ ...newTeam, membersText: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#F8F7F4] border border-[#E2DFD7] text-xs font-mono"
                ></textarea>

                <button type="submit" className="w-full finisterre-btn-rust text-xs py-2">
                  Create Team & Dispatch Credentials
                </button>
              </form>
            </div>
          </div>

          {/* Academic Entities Hierarchy & Cascading Deletions */}
          <div className="space-y-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest text-[#141719] flex items-center space-x-2">
              <FolderTree className="w-4 h-4 text-[#C85A32]" />
              <span>Hierarchical Entities & Cascading Deletion Actions</span>
            </h2>

            {/* Years & Sections Hierarchy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Years List */}
              <div className="bg-white border border-[#E2DFD7] p-5">
                <h3 className="font-display text-xs uppercase tracking-widest font-bold text-[#141719] mb-4">
                  Academic Years ({years.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {years.map((y) => (
                    <div
                      key={y._id}
                      className="p-3 bg-[#F8F7F4] flex items-center justify-between border border-[#E2DFD7]"
                    >
                      <span className="font-mono text-xs font-bold text-[#141719]">{y.name}</span>
                      <button
                        onClick={() => requestDelete('year', y)}
                        className="p-1 text-[#697077] hover:text-[#C85A32] transition"
                        title="Cascade Delete Year"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {years.length === 0 && <p className="font-mono text-xs text-[#9AA1A9]">No years created.</p>}
                </div>
              </div>

              {/* Sections List */}
              <div className="bg-white border border-[#E2DFD7] p-5">
                <h3 className="font-display text-xs uppercase tracking-widest font-bold text-[#141719] mb-4">
                  Sections & Branches ({sections.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {sections.map((s) => (
                    <div
                      key={s._id}
                      className="p-3 bg-[#F8F7F4] flex items-center justify-between border border-[#E2DFD7]"
                    >
                      <div>
                        <span className="font-mono text-xs font-bold text-[#141719]">{s.name}</span>
                        <span className="font-mono text-[10px] text-[#9AA1A9] ml-2">
                          ({s.yearId?.name || 'Cohort'})
                        </span>
                      </div>
                      <button
                        onClick={() => requestDelete('section', s)}
                        className="p-1 text-[#697077] hover:text-[#C85A32] transition"
                        title="Cascade Delete Section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {sections.length === 0 && <p className="font-mono text-xs text-[#9AA1A9]">No sections created.</p>}
                </div>
              </div>
            </div>

            {/* Teams List */}
            <div className="bg-white border border-[#E2DFD7] p-5">
              <h3 className="font-display text-xs uppercase tracking-widest font-bold text-[#141719] mb-4">
                Registered Teams & Leads ({teams.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono text-[#484F56]">
                  <thead className="bg-[#F8F7F4] text-[10px] uppercase font-bold tracking-widest text-[#697077] border-b border-[#E2DFD7]">
                    <tr>
                      <th className="p-3">Team Name</th>
                      <th className="p-3">Cohort / Section</th>
                      <th className="p-3">Team Lead</th>
                      <th className="p-3">Lead Email</th>
                      <th className="p-3">Members</th>
                      <th className="p-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DFD7]">
                    {teams.map((t) => (
                      <tr key={t._id} className="hover:bg-[#F8F7F4]/80">
                        <td className="p-3 font-bold text-[#141719] font-sans">{t.teamName}</td>
                        <td className="p-3">
                          {t.yearId?.name} • {t.sectionId?.name}
                        </td>
                        <td className="p-3">{t.teamLead?.name}</td>
                        <td className="p-3 text-[#C85A32]">{t.teamLead?.email}</td>
                        <td className="p-3">{t.members?.length || 0} members</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => requestDelete('team', t)}
                            className="p-1 text-[#697077] hover:text-[#C85A32] transition"
                            title="Delete Team"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {teams.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-[#9AA1A9]">
                          No teams registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RATING MODAL */}
      {ratingTarget && (
        <RatingModal
          project={ratingTarget}
          onClose={() => setRatingTarget(null)}
          onRatingSubmitted={() => {
            loadTabData();
            setRatingTarget(null);
          }}
        />
      )}

      {/* CONFIRMATION MODAL FOR CASCADING DELETIONS */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title={`Confirm Delete ${confirmDelete.type.toUpperCase()}`}
        message={`Are you sure you want to delete ${confirmDelete.name}?`}
        warningNote={confirmDelete.warningNote}
        loading={confirmDelete.loading}
        onCancel={() => setConfirmDelete({ isOpen: false, type: '', id: null, name: '', warningNote: '', loading: false })}
        onConfirm={handleExecuteDelete}
      />
    </div>
  );
};

export default TeacherDashboard;
