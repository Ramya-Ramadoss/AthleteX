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
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import api from "../services/api";

const Sports = () => {
  const [sports, setSports] = useState([]);
  const [sportName, setSportName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await api.get("/sports/");
      setSports(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch sports");
      console.error("Error fetching sports:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!sportName.trim()) {
      setError("Please enter a sport name");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/sports/${editingId}`, { sport_name: sportName });
        setSuccess("Sport updated successfully!");
      } else {
        await api.post("/sports/", { sport_name: sportName });
        setSuccess("Sport added successfully!");
      }
      setSportName("");
      setEditingId(null);
      setError("");
      setTimeout(() => setSuccess(""), 3000);
      fetchSports();
    } catch (error) {
      setError(error.response?.data?.detail || "Error saving sport");
      console.error("Error saving sport:", error);
    }
  };

  const handleEdit = (sport) => {
    setSportName(sport.sport_name);
    setEditingId(sport.id);
    setError("");
  };

  const handleDelete = async (sportId) => {
    if (window.confirm("Are you sure you want to delete this sport?")) {
      try {
        await api.delete(`/sports/${sportId}`);
        setSuccess("Sport deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
        fetchSports();
      } catch (error) {
        setError("Failed to delete sport");
        console.error("Error deleting sport:", error);
      }
    }
  };

  const handleCancel = () => {
    setSportName("");
    setEditingId(null);
    setError("");
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        🏅 Sports Management
      </Typography>

      <Grid container spacing={3}>
        {/* Form Card */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                {editingId ? "Edit Sport" : "Add New Sport"}
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Sport Name"
                  value={sportName}
                  onChange={(e) => setSportName(e.target.value)}
                  placeholder="e.g., Cricket, Football, Basketball"
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
                Sports List ({sports.length})
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
                      <TableCell sx={{ fontWeight: "bold" }}>Sport Name</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                          No sports added yet. Create one above!
                        </TableCell>
                      </TableRow>
                    ) : (
                      sports.map((sport) => (
                        <TableRow key={sport.id} hover>
                          <TableCell>{sport.sport_name}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(sport)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(sport.id)}
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

export default Sports;
