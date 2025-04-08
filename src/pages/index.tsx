import Head from 'next/head';
import useSWR, {mutate} from 'swr';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useState } from 'react';
import { AddRounded } from '@mui/icons-material';



// Main customer list page for the tech assessment
// Displays customers in a table and allows adding new ones

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  businessName?: string;
};

export type Customers = Customer[];

export type ApiError = {
  code: string;
  message: string;
};


const fetcher = async(url: string) => {
  const response = await fetch(url);
  const body = await response.json();
  if (!response.ok) throw body;
  return body;
}
const Home = () => {
  const { data, error, isLoading } = useSWR<Customers, ApiError>(
    '/api/customers',
    fetcher
  );

// Local state for handling dialog visibility and form input values
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
  });



// This keeps the form inputs controlled and in sync with state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


// Makes a POST request to the API and refreshes the list if successful
  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error creating customer');
      }

      setDialogOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', businessName: '' });
      mutate('/api/customers'); 
    } catch (err) {
      console.error(err);
      alert('Failed to add customer.');
    }
  };
  return (
    <>
      <Head>
        <title>Dwolla | Customers</title>
      </Head>
      <main>
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
  <Paper
    elevation={3}
    sx={{
      width: '100%',
      maxWidth: 900, // Makes the margin box less wide
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6">
        Total Customers: {data?.length || 0}
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddRounded />}
        onClick={() => setDialogOpen(true)}
      >
        Add Customer
      </Button>
    </Box>

    {isLoading && <Typography>Loading...</Typography>}
    {error && <Typography color="error">Error: {error.message}</Typography>}

    {data && (
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Business Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((customer) => (
              <TableRow key={customer.email}>
                <TableCell>{customer.firstName}</TableCell>
                <TableCell>{customer.lastName}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.businessName || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Paper>
</Box>


        {/* Dialog -> Pops open when the "Add Customer" button is clicked */}

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Add a New Customer</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx = {{display: 'flex', gap: 2}}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
              
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              fullWidth
            />

          </Box>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              type="email"
            />
            
          </DialogContent>
          <DialogActions>
  <Button onClick={() => { 
    setDialogOpen(false); 
    setFormData({ firstName: '', lastName: '', email: '', businessName: '' }); // Clear fields on cancel
  }}>
    Cancel
  </Button>
  <Button onClick={handleSubmit} variant="contained">Add</Button>
</DialogActions>
        </Dialog>
      </main>
    </>
  );
};

export default Home;