import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export const Header = () => {
  return (
    <Box sx={{ flexGrow: 1, minWidth: 800 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            StopUpsAPI
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
