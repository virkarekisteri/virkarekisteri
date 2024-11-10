import { Box, Button, Container, Typography } from "@mui/material";

const App = () => {
  return (
    <div>
      <Container maxWidth="xs">
        <Box
        component="img"
        sx={{
          marginTop: 8,
          height: "145px"
        }}
        alt="Logo"
        src="/public/seinajoki-logo.jpg"
        >
        </Box>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center", marginTop: 2 }}>
          Joku teksti
        </Typography>
        <Box textAlign='center' sx={{ marginTop: 4 }}>
        <Button variant="contained" sx={{backgroundColor: "#223B7C"}}>Kirjaudu sisään</Button>
        </Box>
      </Container>
      {/* Other components and content will go here */}
    </div>
  );
};

export default App;
