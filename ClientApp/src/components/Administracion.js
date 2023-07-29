import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Categorias from "./Categorias";
import Usuarios from "./Usuarios";
import VentasReporte from "./VentasReporte";
import { styled } from "@mui/system";

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column", // changed to column for vertical layout
  alignItems: "center", // align items to center horizontally
  justifyContent: "space-evenly", // space items evenly
  padding: theme.spacing(4), // use theme spacing for consistency
  backgroundColor: "#eff7ef",
  gap: theme.spacing(1), // consistent spacing with theme
  maxHeight: "100%", // to take full height of the parent
  overflow: "auto", // to enable scrolling if content overflows
}));

const TabContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  padding: theme.spacing(3),
  borderRadius: "10px",
  border: "1px solid #ccc",
  boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.15)",
  transition: "box-shadow 0.3s ease",
  width: "100%", // to take full width of the parent
  maxWidth: "1200px", // limit the maximum width
  boxSizing: "border-box", // to include padding and border in element's total width and height
}));

function Administracion() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (user.rol !== "Administrador") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <StyledBox>
      <Typography variant="h4" component="h1" gutterBottom sx={{fontWeight: "bold" }}>
        Administración
      </Typography>
      <TabContainer>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Categorias" />
          <Tab label="Usuarios" />
          <Tab label="Ventas" />
        </Tabs>
        {tabValue === 0 && <Categorias />}
        {tabValue === 1 && <Usuarios />}
        {tabValue === 2 && <VentasReporte />}
      </TabContainer>
    </StyledBox>
  );
}

export default Administracion;
