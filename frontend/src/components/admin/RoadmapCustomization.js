import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  IconButton,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import { useRoadmap } from '../../context/RoadmapContext';

const RoadmapCustomization = () => {
  const { roadmapNodes, updateRoadmap } = useRoadmap();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [newNode, setNewNode] = useState({
    title: '',
    position: 'left',
    locked: false,
    isTest: false,
    link: '',
    completed: false,
    stars: 0,
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const reorderedNodes = Array.from(roadmapNodes);
    const [removed] = reorderedNodes.splice(sourceIndex, 1);
    reorderedNodes.splice(destinationIndex, 0, removed);

    updateRoadmap(reorderedNodes);
  };

  const handleOpenDialog = (node = null) => {
    if (node) {
      setEditingNode(node);
      setNewNode(node);
    } else {
      setEditingNode(null);
      setNewNode({
        title: '',
        position: 'left',
        locked: false,
        isTest: false,
        link: '',
        completed: false,
        stars: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNode(null);
    setNewNode({
      title: '',
      position: 'left',
      locked: false,
      isTest: false,
      link: '',
      completed: false,
      stars: 0,
    });
  };

  const handleSaveNode = async () => {
    try {
      if (editingNode) {
        const updatedNodes = roadmapNodes.map(node => 
          node.id === editingNode.id ? { ...newNode, id: node.id } : node
        );
        updateRoadmap(updatedNodes);
      } else {
        const newId = Math.max(...roadmapNodes.map(n => n.id)) + 1;
        const updatedNodes = [...roadmapNodes, { ...newNode, id: newId }];
        updateRoadmap(updatedNodes);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving node:', error);
    }
  };

  const handleDeleteNode = async (nodeId) => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      try {
        const updatedNodes = roadmapNodes.filter(node => node.id !== nodeId);
        updateRoadmap(updatedNodes);
      } catch (error) {
        console.error('Error deleting node:', error);
      }
    }
  };

  const handleLearnTemplate = (nodeId) => {
    console.log('Opening learn template for node:', nodeId);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Roadmap Customization</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Node
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Paper sx={{ p: 2 }}>
          <Droppable droppableId="droppable-roadmap-nodes">
            {(provided, snapshot) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ 
                  minHeight: '100px',
                  bgcolor: 'background.paper',
                }}
              >
                {roadmapNodes.map((node, index) => (
                  <Draggable
                    key={node.id.toString()}
                    draggableId={`draggable-${node.id.toString()}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          marginBottom: '8px'
                        }}
                      >
                        <ListItem
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            backgroundColor: snapshot.isDragging 
                              ? '#e3f2fd' 
                              : node.isTest 
                                ? '#fff3e0' 
                                : 'background.paper',
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                            },
                          }}
                        >
                          <Box
                            {...provided.dragHandleProps}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'move',
                              mr: 2,
                              '&:active': {
                                cursor: 'grabbing',
                              },
                            }}
                          >
                            <DragIndicatorIcon color="action" />
                          </Box>

                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1">{node.title}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                              <Typography variant="body2" color="textSecondary">
                                Position: {node.position}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {node.locked ? 'Locked' : 'Unlocked'}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {node.isTest ? 'Test Node' : 'Regular Node'}
                              </Typography>
                              <Rating
                                value={node.stars}
                                readOnly
                                icon={<StarIcon fontSize="small" />}
                                emptyIcon={<StarIcon fontSize="small" />}
                              />
                            </Box>
                            {node.link && (
                              <Typography variant="body2" color="primary">
                                Link: {node.link}
                              </Typography>
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                            <IconButton 
                              onClick={() => handleLearnTemplate(node.id)}
                              size="small"
                              color="primary"
                              title="Update Learn Template"
                            >
                              <SchoolIcon />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleOpenDialog(node)}
                              size="small"
                              title="Edit Node"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDeleteNode(node.id)}
                              size="small"
                              color="error"
                              title="Delete Node"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </ListItem>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </Paper>
      </DragDropContext>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingNode ? 'Edit Roadmap Node' : 'Add New Roadmap Node'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              value={newNode.title}
              onChange={(e) => setNewNode({ ...newNode, title: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Position</InputLabel>
              <Select
                value={newNode.position}
                onChange={(e) => setNewNode({ ...newNode, position: e.target.value })}
                label="Position"
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Link"
              value={newNode.link}
              onChange={(e) => setNewNode({ ...newNode, link: e.target.value })}
              fullWidth
            />
            <Rating
              value={newNode.stars}
              onChange={(event, newValue) => {
                setNewNode({ ...newNode, stars: newValue });
              }}
              icon={<StarIcon fontSize="small" />}
              emptyIcon={<StarIcon fontSize="small" />}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newNode.locked}
                  onChange={(e) => setNewNode({ ...newNode, locked: e.target.checked })}
                />
              }
              label="Locked"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newNode.isTest}
                  onChange={(e) => setNewNode({ ...newNode, isTest: e.target.checked })}
                />
              }
              label="Test Node"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newNode.completed}
                  onChange={(e) => setNewNode({ ...newNode, completed: e.target.checked })}
                />
              }
              label="Completed"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveNode} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoadmapCustomization; 