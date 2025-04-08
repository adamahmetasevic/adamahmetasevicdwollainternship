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
        <Box>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {data && (
            <ul>
              {data.map(customer => (
                <li key={customer.email}>
                  {customer.firstName} {customer.lastName}
                </li>
              ))}
            </ul>
          )}
        </Box>
      </main>
    </>
  );
};
 

export default Home;