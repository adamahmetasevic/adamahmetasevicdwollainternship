import Head from 'next/head';
import useSWR from 'swr';
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
