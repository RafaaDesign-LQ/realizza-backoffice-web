import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Typography } from "@mui/material";

export default function FinalizarSorteio() {
  return (
    <Box sx={{ width: 2000, margin: "0 auto" }}>
      <Box sx={{ padding: 5, display: "flex", justifyContent: "flex-end" }}>
        <FormControl variant="standard" sx={{ minWidth: 200 }}>
          <InputLabel id="demo-simple-select-standard-label" sx={{ fontSize: "1.2rem" }}>
            Sorteio
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            label="Age"
            sx={{ fontSize: "5rem", height: 50 }}
          >
            <MenuItem value={10}>BMW X1</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "flex", gap: "1.5rem", flexDirection: "column" }}>
        <Typography
          variant="h2"
          sx={{
            background: "linear-gradient(90deg, #44B8C3 1%, #C1BB6C 20%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Prêmio Disponível <br /> para Sorteio
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
        >
          Data do Sorteio Programada
        </Typography>
      </Box>
    </Box>
  );
}
