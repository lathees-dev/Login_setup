import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const ModuleForm = ({ module, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(
    module || {
      title: "",
      chapters: [{ title: "", content: "", video_url: "", image_url: "" }],
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box sx={{ p: 3, minWidth: 500 }}>
      <Typography variant="h6" mb={2}>
        {module ? "Edit Module" : "Add New Module"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Module Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          margin="normal"
        />

        {formData.chapters.map((chapter, index) => (
          <Box key={index} sx={{ mt: 2, p: 2, border: "1px solid #ddd" }}>
            <Typography variant="subtitle1">Chapter {index + 1}</Typography>
            <TextField
              fullWidth
              label="Chapter Title"
              value={chapter.title}
              onChange={(e) => {
                const newChapters = [...formData.chapters];
                newChapters[index].title = e.target.value;
                setFormData({ ...formData, chapters: newChapters });
              }}
              margin="normal"
            />
            {/* Add more chapter fields */}
          </Box>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={() => {
            setFormData({
              ...formData,
              chapters: [
                ...formData.chapters,
                { title: "", content: "", video_url: "", image_url: "" },
              ],
            });
          }}
        >
          Add Chapter
        </Button>

        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            {module ? "Update" : "Create"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ModuleForm;
