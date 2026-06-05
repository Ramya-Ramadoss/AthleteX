import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Home from "./pages/Home";
import Sports from "./pages/Sports";
import Training from "./pages/Training";
import Performance from "./pages/Performance";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const Navigation = () => {
  const location = useLocation();
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Sports", path: "/sports" },
    { label: "Training", path: "/training" },
    { label: "Performance", path: "/performance" },
  ];

  return (
    <AppBar position="sticky" sx={{ mb: 4 }}>
      <Toolbar>
        <FitnessCenterIcon sx={{ mr: 2 }} />
        <Box sx={{ flexGrow: 1, fontSize: "1.25rem", fontWeight: "bold" }}>
          AthleteX
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={RouterLink}
              to={item.path}
              color="inherit"
              sx={{
                fontWeight: location.pathname === item.path ? "bold" : "normal",
                borderBottom: location.pathname === item.path ? "3px solid white" : "none",
                borderRadius: 0,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/training" element={<Training />} />
            <Route path="/performance" element={<Performance />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
