import { AppBar, Box, Toolbar } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ flexGrow: 1, minWidth: 800 }}>
      <AppBar position="static">
        <Toolbar />
      </AppBar>
    </Box>
  );
};

export default Footer;
