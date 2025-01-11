import React, { createContext, useState, useContext, useEffect } from 'react';

const RoadmapContext = createContext();

// Add the default nodes here so both components can access the same initial data
const defaultRoadmapNodes = [
  {
    id: 1,
    title: "Introduction to Communication",
    completed: true,
    stars: 3,
    position: "left",
    link: "/communication",
    locked: false,
    isTest: false,
  },
  // ... add all other default nodes
];

export const RoadmapProvider = ({ children }) => {
  // Initialize state with data from localStorage or default nodes
  const [roadmapNodes, setRoadmapNodes] = useState(() => {
    const savedNodes = localStorage.getItem('roadmapNodes');
    return savedNodes ? JSON.parse(savedNodes) : defaultRoadmapNodes;
  });

  // Update localStorage whenever roadmapNodes changes
  useEffect(() => {
    localStorage.setItem('roadmapNodes', JSON.stringify(roadmapNodes));
  }, [roadmapNodes]);

  const updateRoadmap = (newNodes) => {
    setRoadmapNodes(newNodes);
  };

  return (
    <RoadmapContext.Provider value={{ roadmapNodes, updateRoadmap }}>
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => useContext(RoadmapContext);