import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(() => {
    const saved = localStorage.getItem('teacherUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [teamLeadData, setTeamLeadData] = useState(() => {
    const saved = localStorage.getItem('teamLeadData');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  // Teacher Login
  const loginTeacher = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/teacher/login', { email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('teacherToken', token);
      localStorage.setItem('teacherUser', JSON.stringify(userData));
      setTeacher(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logoutTeacher = () => {
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacherUser');
    setTeacher(null);
  };

  // Team Lead Verification & Login
  const verifyTeamLead = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/team-lead/login', { email, password });
      const { token, team } = res.data;
      localStorage.setItem('teamLeadToken', token);
      localStorage.setItem('teamLeadData', JSON.stringify(team));
      setTeamLeadData(team);
      return { success: true, team };
    } catch (err) {
      // Return exact error message from backend
      return {
        success: false,
        message: err.response?.data?.message || 'Authentication error',
      };
    } finally {
      setLoading(false);
    }
  };

  // Student Team Self-Registration
  const registerStudentTeam = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/team/register', formData);
      const { token, team } = res.data;
      localStorage.setItem('teamLeadToken', token);
      localStorage.setItem('teamLeadData', JSON.stringify(team));
      setTeamLeadData(team);
      return { success: true, team, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const logoutTeamLead = () => {
    localStorage.removeItem('teamLeadToken');
    localStorage.removeItem('teamLeadData');
    setTeamLeadData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        teacher,
        teamLeadData,
        loading,
        loginTeacher,
        logoutTeacher,
        verifyTeamLead,
        registerStudentTeam,
        logoutTeamLead,
        setTeamLeadData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

