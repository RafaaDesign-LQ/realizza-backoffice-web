import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Alert, Box, Button, Container, Snackbar, Stack, SvgIcon, Typography } from "@mui/material";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { GetAllClientsUseCase } from "src/provider/useCases/clients/get-all-client.usecase";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { CustomersTable } from "src/sections/customer/customers-table";
import { EditCustomerDialog } from "src/sections/customer/edit-customer-dialog";
import { GiveTicketDialog } from "src/sections/customer/give-ticket-customer-dialog";
import { applyPagination } from "src/utils/apply-pagination";

const Page = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snakBarMsg, setSnakBarMsg] = useState("");
  const [snakBarOpen, setSnakBarOpen] = useState(false);
  const [snackBarStatus, setSnackBarStatus] = useState("success");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState("close");
  const [dialogData, setDialogData] = useState({});

  const useCustomers = (page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(data?.users, page, rowsPerPage);
    }, [page, rowsPerPage]);
  };

  const useCustomerIds = (customers) => {
    return useMemo(() => {
      return customers?.map((customer) => customer.id);
    }, [customers]);
  };

  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  useEffect(() => {
    GetAllClientsUseCase(search.length > 0 ? search : "", page, rowsPerPage).then((response) => {
      setData(response.value);
    });
  }, [search, page, rowsPerPage, dialog]);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleEditButton = (id, name, document, email) => {
    setDialogData({
      id,
      name,
      document,
      email,
    });
    setDialog("edit");
  };

  const handleGiveTicketButton = (id, name, document, email) => {
    setDialogData({
      id,
      name,
      document,
      email,
    });
    setDialog("giveticket");
  };

  return (
    <>
      <Head>
        <title>Clientes | Realizza Backoffice</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Clientes</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CustomersSearch search={search} onChange={handleChangeSearch} />
            <CustomersTable
              count={data.usersCount}
              items={data.users}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
              handleEdit={handleEditButton}
              handleGiveTicket={handleGiveTicketButton}
            />
          </Stack>
        </Container>
      </Box>
      <EditCustomerDialog
        dialog={dialog}
        setDialog={setDialog}
        data={dialogData}
        setSnakBarMsg={setSnakBarMsg}
        setSnakBarOpen={setSnakBarOpen}
        setSnackBarStatus={setSnackBarStatus}
      />
      <GiveTicketDialog
        dialog={dialog}
        setDialog={setDialog}
        data={dialogData}
        setSnakBarMsg={setSnakBarMsg}
        setSnakBarOpen={setSnakBarOpen}
        setSnackBarStatus={setSnackBarStatus}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        open={snakBarOpen}
        onClose={() => setSnakBarOpen(false)}
      >
        <Alert
          onClose={() => setSnakBarOpen(false)}
          severity={snackBarStatus}
          sx={{ width: "100%" }}
        >
          {snakBarMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
