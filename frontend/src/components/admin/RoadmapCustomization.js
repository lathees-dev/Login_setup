import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ModuleForm from "./ModuleForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styled } from "@mui/material/styles";

// Styled components for the roadmap visualization
const RoadmapContainer = styled(Box)({
  position: "relative",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "2rem",
  minHeight: "600px",
});

const ModuleNode = styled(Paper)(({ completed }) => ({
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  backgroundColor: completed ? "#e3f2fd" : "#f5f5f5",
  cursor: "grab",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
  },
}));

const ConnectingLine = styled("div")({
  position: "absolute",
  height: "4px",
  backgroundColor: "#bdbdbd",
  transform: "rotate(45deg)",
  transformOrigin: "0 0",
  zIndex: -1,
});

const RoadmapCustomization = () => {
  const [modules, setModules] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const response = await fetch("/api/admin/modules/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setModules(items);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const positions = {};
      items.forEach((item, index) => {
        positions[item.id] = index + 1;
      });

      await fetch("/api/admin/modules/update-positions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify(positions),
      });
    } catch (error) {
      console.error("Error updating positions:", error);
    }
  };

  const handleDelete = async (moduleId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await fetch(`/api/admin/modules/${moduleId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      fetchModules();
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  const calculateNodePosition = (index, totalNodes) => {
    const radius = 300; // Adjust based on your container size
    const angle = (index / totalNodes) * Math.PI * 2;
    const x = radius * Math.cos(angle) + radius;
    const y = radius * Math.sin(angle) + radius;
    return { x, y };
  };

  const renderConnectingLines = () => {
    return modules.map((module, index) => {
      if (index === modules.length - 1) return null;

      const start = calculateNodePosition(index, modules.length);
      const end = calculateNodePosition(index + 1, modules.length);

      const length = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      const angle = Math.atan2(end.y - start.y, end.x - start.x);

      return (
        <ConnectingLine
          key={`line-${index}`}
          style={{
            width: `${length}px`,
            left: `${start.x}px`,
            top: `${start.y}px`,
            transform: `rotate(${angle}rad)`,
          }}
        />
      );
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Customize Roadmap</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setOpenForm(true)}
        >
          Add Module
        </Button>
      </Box>

      <RoadmapContainer>
        {renderConnectingLines()}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="roadmap">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {modules.map((module, index) => {
                  const position = calculateNodePosition(index, modules.length);
                  return (
                    <Draggable
                      key={module.id}
                      draggableId={module.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <ModuleNode
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            position: "absolute",
                            left: position.x - 90,
                            top: position.y - 90,
                          }}
                          completed={!module.is_locked}
                        >
                          <Typography variant="h6" align="center">
                            {module.title}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingModule(module);
                                setOpenForm(true);
                              }}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(module.id);
                              }}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </ModuleNode>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </RoadmapContainer>

      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingModule(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <ModuleForm
          module={editingModule}
          onClose={() => {
            setOpenForm(false);
            setEditingModule(null);
          }}
          onSubmit={async (data) => {
            try {
              const userInfo = JSON.parse(localStorage.getItem("userInfo"));
              const method = editingModule ? "PUT" : "POST";
              const url = editingModule
                ? `/api/admin/modules/${editingModule.id}/`
                : "/api/admin/modules/";

              await fetch(url, {
                method,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userInfo?.token}`,
                },
                body: JSON.stringify(data),
              });

              fetchModules();
              setOpenForm(false);
              setEditingModule(null);
            } catch (error) {
              console.error("Error saving module:", error);
            }
          }}
        />
      </Dialog>
    </Box>
  );
};

export default RoadmapCustomization;
