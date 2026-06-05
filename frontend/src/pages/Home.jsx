import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Link as RouterLink } from "react-router-dom";

const Home = () => {
  const modules = [
    {
      title: "Sports",
      description: "Manage different sports like Cricket, Football, Badminton, Running, etc.",
      icon: SportsSoccerIcon,
      path: "/sports",
      color: "#ff6b6b",
    },
    {
      title: "Training",
      description: "Record your training sessions with date, sport, and hours practiced.",
      icon: FitnessCenterIcon,
      path: "/training",
      color: "#4ecdc4",
    },
    {
      title: "Performance",
      description: "Track your performance metrics: speed, accuracy, stamina, and overall score.",
      icon: TrendingUpIcon,
      path: "/performance",
      color: "#ffd93d",
    },
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
          Welcome to AthleteX 🏆
        </Typography>
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Your personal sports training tracker. Manage sports, log training sessions, and monitor your performance.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Grid item xs={12} md={4} key={module.title}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Icon sx={{ fontSize: 48, color: module.color }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 1 }}>
                    {module.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
                    {module.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to={module.path}
                    sx={{
                      backgroundColor: module.color,
                      "&:hover": { backgroundColor: module.color, opacity: 0.8 },
                    }}
                  >
                    Go to {module.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 6, p: 3, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          ℹ️ How It Works
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>1. Create Sports:</strong> Start by adding the sports you practice (Cricket, Football, etc.)
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>2. Log Training:</strong> Record your training sessions with the sport, date, and hours spent.
        </Typography>
        <Typography variant="body2">
          <strong>3. Track Performance:</strong> Monitor your speed, accuracy, stamina metrics and see your overall score improve!
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
