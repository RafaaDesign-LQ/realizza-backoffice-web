import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Grid, Input, TextField, Typography } from "@mui/material";
import { Layout } from "src/layouts/dashboard/layout";
import { CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import BMWImage from "src/assets/images/BMW.png";
import LoteriaFederalImg from "src/assets/images/loteriafederal.png";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import StarIcon from "src/assets/images/stars.svg";
import { GetAllDrawsUsecase } from "src/provider/useCases/draws/get-all-draws.usecase";
import { useEffect, useState } from "react";
import { GetOneDraw } from "src/provider/useCases/draws/get-one-draw-usecase";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { PatchFinalizeDraw } from "src/provider/useCases/draws/patch-finalize-draw-usecase";
import BasicModal from "src/components/modal";
import { useModal } from "src/hooks/use-modal";

export default function FinalizarSorteio() {
  const modalDataWinner = useModal();
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [winner, setWinner] = useState();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmitDate = (data) => console.log(data);
  const onSubmitCheckWinner = async (data) => {
    const drawId = selectedDraw?.id;
    const ticketNumber = data.ticket;

    const winner = await PatchFinalizeDraw(drawId, ticketNumber);
    setWinner(winner.winnerTicket?._props);
  };

  const getDraws = async () => {
    const draws = await GetAllDrawsUsecase();
    setDraws(draws);
  };

  const handlePrize = async (event) => {
    const selectedDraw = await GetOneDraw(event.target.value);
    setSelectedDraw(selectedDraw);

    if (selectedDraw.winnerTicket) {
      setWinner(selectedDraw?.winnerTicket);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    getDraws();
  }, []);

  console.log(winner);

  return (
    <Layout>
      <Box sx={{ width: 1200, margin: "0 auto" }}>
        <Box sx={{ padding: 5, paddingLeft: 100 }}>
          <FormControl variant="standard" sx={{ minWidth: 200 }}>
            <InputLabel id="demo-simple-select-standard-label" sx={{ fontSize: "1.2rem" }}>
              Sorteio
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Age"
              sx={{ fontSize: "5rem", height: 50 }}
              onChange={handlePrize}
            >
              {draws?.map((draw) => (
                <MenuItem value={draw.id} key={draw.id}>
                  {draw.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", gap: 20 }}>
          <Box sx={{ display: "flex", gap: "1.5rem", flexDirection: "column" }}>
            <Typography
              variant="h2"
              sx={{
                background: "linear-gradient(90deg, #44B8C3 1%, #C1BB6C 50%)",
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

            <form onSubmit={handleSubmit(onSubmitDate)}>
              <Box sx={{ display: "flex", justifyItems: "center", alignItems: "center", gap: 1 }}>
                <Typography color="#A8A6A6">DATA:</Typography>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Selecione"
                    renderInput={(props) => <TextField {...props} sx={{ color: "red" }} />}
                    onChange={handleDateChange}
                    inputFormat="dd/MM/yyyy"
                    value={selectedDate}
                  />
                </LocalizationProvider>

                {selectedDate && (
                  <Button variant="contained" color="success" type="submit">
                    Confirmar
                  </Button>
                )}
              </Box>
            </form>
          </Box>

          <Box>
            {selectedDraw?.name === "Sorteio BMW X1" && (
              <Image src={BMWImage} alt="A Bmw X1 car" width={504} height={336} />
            )}
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "7rem",
            boxShadow: 3,
            borderRadius: 1,
            padding: 2,
            marginTop: 10,
          }}
        >
          <Typography color="#A8A6A6" fontSize={13}>
            PERCENTUAL DE TICKETS VENDIDOS
          </Typography>
          <Typography color="black" fontWeight={700} fontSize={25}>
            {selectedDraw?.percentage}%
          </Typography>

          <LinearProgress
            variant="determinate"
            value={selectedDraw?.percentage || 0}
            sx={{ height: 10 }}
          />
        </Box>

        <form onSubmit={handleSubmit(onSubmitCheckWinner)}>
          <Box
            sx={{
              display: "flex",
              marginTop: 10,
              alignItems: "center",
              gap: 5,
              justifyContent: "center",
            }}
          >
            <Image
              src={LoteriaFederalImg}
              width={266}
              height={124}
              alt="A image with letters write loteria federal"
            />

            <Typography textAlign="end" fontWeight={700}>
              NÚMERO SORTEADO <br />
            </Typography>

            <TextField id="outlined-basic" variant="outlined" {...register("ticket")} />

            <Button variant="contained" size="large" type="submit">
              CONFERIR GANHADOR
            </Button>
          </Box>
        </form>

        {winner && (
          <Box sx={{ display: "flex", justifyItems: "center", alignItems: "center" }} mt={5} mb={5}>
            <div>
              <Typography fontSize={30} fontWeight={700}>
                Proprietário do número sorteado:
              </Typography>
              <Typography
                fontSize={55}
                fontWeight={700}
                sx={{
                  background: "linear-gradient(90deg, #44B8C3 1%, #C1BB6C 20%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                GANHADOR
              </Typography>
              <Image src={StarIcon} alt="Stars" width={262} height={42} />
              <Typography
                fontSize={55}
                fontWeight={700}
                sx={{
                  background: "linear-gradient(90deg, #44B8C3 1%, #C1BB6C 20%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {winner.owner.name}
              </Typography>
              <Typography fontSize={25} fontWeight={700}>
                COTA GANHADORA
              </Typography>
              <Typography fontSize={25} fontWeight={700}>
                {winner.ticketNumber}
              </Typography>
            </div>

            <div>
              <BasicModal open={modalDataWinner.open} handleClose={modalDataWinner.handleClose}>
                <Typography>Nome: {winner.owner.name}</Typography>
                <Typography>Email: {winner.owner.email}</Typography>
                <Typography>CPF: {winner.owner.document}</Typography>

                <Typography>
                  Email secundário: {winner.owner.contacts && winner.owner?.contacts[0]?.email}
                </Typography>
                <Typography>
                  Telefone: {winner.owner.contacts && winner.owner?.contacts[0]?.cellPhone}
                </Typography>
              </BasicModal>
              <Button
                sx={{ fontSize: "2rem" }}
                variant="outlined"
                onClick={() => modalDataWinner.handleOpen()}
              >
                Ver Dados do Ganhador
              </Button>
            </div>
          </Box>
        )}
      </Box>
    </Layout>
  );
}
