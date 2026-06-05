import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  IconButton,
  MenuItem,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import api from "../services/api";

const Training = () => {
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [sports, setSports] = useState([]);
  const [sportId, setSportId] = useState("");
  const [trainingDate, setTrainingDate] = useState("");
  const [hours, setHours] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSports();
    fetchTrainingLogs();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await api.get("/sports/");
      setSports(response.data);
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  const fetchTrainingLogs = async () => {
    try {
      const response = await api.get("/training/");
      setTrainingLogs(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch training logs");
      console.error("Error fetching training logs:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!sportId || !trainingDate || !hours) {
      setError("Please fill in all fields");
      return;
    }

    const payload = {
      sport_id: Number(sportId),
      training_date: trainingDate,
      hours: Number(hours),
    };

    try {
      if (editingId) {
        await api.put(`/training/${editingId}`, payload);
        setSuccess("Training log updated successfully!");
      } else {
        await api.post("/training/", payload);
        setSuccess("Training log added successfully!");
      }
      setSportId("");
      setTrainingDate("");
      setHours("");
      setEditingId(null);
      setError("");
      setTimeout(() => setSuccess(""), 3000);
      fetchTrainingLogs();
    } catch (error) {
      setError(error.response?.data?.detail || "Error saving training log");
      console.error("Error saving training log:", error);
    }
  };

  const handleEdit = (log) => {
    setSportId(log.sport_id);
    setTrainingDate(log.training_date);
    setHours(log.hours);
    setEditingId(log.id);
    setError("");
  };

  const handleDelete = async (logId) => {
    if (window.confirm("Are you sure you want to delete this training log?")) {
      try {
        await api.delete(`/training/${logId}`);
        setSuccess("Training log deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
        fetchTrainingLogs();
      } catch (error) {
        setError("Failed to delete training log");
        console.error("Error deleting training log:", error);
      }
    }
  };

  const handleCancel = () => {
    setSportId("");
    setTrainingDate("");
    setHours("");
    setEditingId(null);
    setError("");
  };

  const getSportName = (id) => {
    const sport = sports.find((s) => s.id === id);
    return sport ? sport.sport_name : `Sport #${id}`;
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        📅 Training Logs
      </Typography>

      <Grid container spacing={3}>
        {/* Form Card */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                {editingId ? "Edit Training Log" : "Add Training Session"}
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  select
                  fullWidth
                  label="Sport"
                  value={sportId}
                  onChange={(e) => setSportId(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 1 }}
                  helperText={sports.length === 0 ? "Add some sports first on the Sports page." : "Select the sport for this session."}
                >
                  <MenuItem value="">-- Select a sport --</MenuItem>
                  {sports.map((sport) => (
                    <MenuItem key={sport.id} value={sport.id}>
                      {sport.sport_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Training Date"
                  type="date"
                  value={trainingDate}
                  onChange={(e) => setTrainingDate(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Practice Hours"
                  type="number"
                  inputProps={{ step: "0.5", min: "0" }}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="e.g., 2.5"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ flex: 1 }}
                  >
                    {editingId ? "Update" : "Add"}
                  </Button>
                  {editingId && (
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{ flex: 1 }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* List Card */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Training Records ({trainingLogs.length})
              </Typography>
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Sport</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Hours
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trainingLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                          No training logs yet. Start tracking your sessions!
                        </TableCell>
                      </TableRow>
                    ) : (
                      trainingLogs.map((log) => (
                        <TableRow key={log.id} hover>
                          <TableCell>{getSportName(log.sport_id)}</TableCell>
                          <TableCell>{log.training_date}</TableCell>
                          <TableCell align="right">{log.hours}h</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(log)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(log.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Training;
