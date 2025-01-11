import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../config/axios';

const RoadmapContext = createContext();

export const RoadmapProvider = ({ children }) => {
  const [roadmapNodes, setRoadmapNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoadmapNodes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/roadmap/');
      setRoadmapNodes(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      setError('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmapNodes();
  }, []);

  const updateRoadmap = async (newNodes) => {
    try {
      setLoading(true);
      await axios.post('/api/roadmap/save/', newNodes);
      await fetchRoadmapNodes(); // Refresh the nodes after saving
      return true;
    } catch (error) {
      console.error('Error saving roadmap:', error);
      setError('Failed to save roadmap');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoadmapContext.Provider value={{ 
      roadmapNodes, 
      updateRoadmap, 
      loading,
      error,
      refreshRoadmap: fetchRoadmapNodes 
    }}>
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => useContext(RoadmapContext);