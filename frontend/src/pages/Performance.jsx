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
  LinearProgress,
  Grid,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import api from "../services/api";

const Performance = () => {
  const [records, setRecords] = useState([]);
  const [speed, setSpeed] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [stamina, setStamina] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPerformanceRecords();
  }, []);

  const fetchPerformanceRecords = async () => {
    try {
      const response = await api.get("/performance/");
      setRecords(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch performance records");
      console.error("Error fetching performance records:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!speed || !accuracy || !stamina) {
      setError("Please fill in all fields");
      return;
    }

    if (speed < 0 || accuracy < 0 || stamina < 0 || speed > 100 || accuracy > 100 || stamina > 100) {
      setError("All values must be between 0 and 100");
      return;
    }

    const payload = {
      speed: Number(speed),
      accuracy: Number(accuracy),
      stamina: Number(stamina),
    };

    try {
      if (editingId) {
        await api.put(`/performance/${editingId}`, payload);
        setSuccess("Performance record updated successfully!");
      } else {
        await api.post("/performance/", payload);
        setSuccess("Performance record added successfully!");
      }
      setSpeed("");
      setAccuracy("");
      setStamina("");
      setEditingId(null);
      setError("");
      setTimeout(() => setSuccess(""), 3000);
      fetchPerformanceRecords();
    } catch (error) {
      setError(error.response?.data?.detail || "Error saving performance record");
      console.error("Error saving performance record:", error);
    }
  };

  const handleEdit = (record) => {
    setSpeed(record.speed);
    setAccuracy(record.accuracy);
    setStamina(record.stamina);
    setEditingId(record.id);
    setError("");
  };

  const handleDelete = async (recordId) => {
    if (window.confirm("Are you sure you want to delete this performance record?")) {
      try {
        await api.delete(`/performance/${recordId}`);
        setSuccess("Performance record deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
        fetchPerformanceRecords();
      } catch (error) {
        setError("Failed to delete performance record");
        console.error("Error deleting performance record:", error);
      }
    }
  };

  const handleCancel = () => {
    setSpeed("");
    setAccuracy("");
    setStamina("");
    setEditingId(null);
    setError("");
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#4caf50";
    if (score >= 60) return "#ff9800";
    return "#f44336";
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        📊 Performance Tracking
      </Typography>

      <Grid container spacing={3}>
        {/* Form Card */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                {editingId ? "Edit Performance" : "Log Performance"}
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Speed (0-100)"
                  type="number"
                  inputProps={{ min: "0", max: "100", step: "1" }}
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  helperText="Higher values improve your overall score."
                />

                <TextField
                  fullWidth
                  label="Accuracy (0-100)"
                  type="number"
                  inputProps={{ min: "0", max: "100", step: "1" }}
                  value={accuracy}
                  onChange={(e) => setAccuracy(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  helperText="Accuracy should reflect how well you performed."
                />

                <TextField
                  fullWidth
                  label="Stamina (0-100)"
                  type="number"
                  inputProps={{ min: "0", max: "100", step: "1" }}
                  value={stamina}
                  onChange={(e) => setStamina(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                {/* Preview overall score */}
                {speed && accuracy && stamina && (
                  <Card sx={{ mb: 3, backgroundColor: "#f5f5f5" }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          Overall Score:
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color: getScoreColor((Number(speed) + Number(accuracy) + Number(stamina)) / 3),
                            }}
                          >
                            {((Number(speed) + Number(accuracy) + Number(stamina)) / 3).toFixed(1)}
                          </Typography>
                          <Chip
                            label={getScoreBadge((Number(speed) + Number(accuracy) + Number(stamina)) / 3)}
                            size="small"
                            color="primary"
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}

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
                Performance Records ({records.length})
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
                      <TableCell sx={{ fontWeight: "bold" }}>Speed</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Accuracy</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Stamina</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Overall Score</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          No performance records yet. Log your first performance!
                        </TableCell>
                      </TableRow>
                    ) : (
                      records.map((record) => (
                        <TableRow key={record.id} hover>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box sx={{ width: 60 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={record.speed}
                                  sx={{ height: 6, borderRadius: 3 }}
                                />
                              </Box>
                              <Typography variant="body2">{record.speed}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box sx={{ width: 60 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={record.accuracy}
                                  sx={{ height: 6, borderRadius: 3 }}
                                />
                              </Box>
                              <Typography variant="body2">{record.accuracy}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box sx={{ width: 60 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={record.stamina}
                                  sx={{ height: 6, borderRadius: 3 }}
                                />
                              </Box>
                              <Typography variant="body2">{record.stamina}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: "bold",
                                  color: getScoreColor(record.overall_score),
                                  fontSize: "1.1rem",
                                }}
                              >
                                {record.overall_score.toFixed(1)}
                              </Typography>
                              <Chip
                                label={getScoreBadge(record.overall_score)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(record)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(record.id)}
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

export default Performance;
