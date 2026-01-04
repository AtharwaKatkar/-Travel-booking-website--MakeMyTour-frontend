import { NextPage } from 'next';
import Head from 'next/head';
import CancellationDashboard from '../components/Cancellation/CancellationDashboard';

const CancellationPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>My Bookings - Cancellation & Refunds | MakeMyTrip</title>
        <meta 
          name="description" 
          content="Manage your bookings, cancel reservations, and track refunds easily with MakeMyTrip's comprehensive cancellation system." 
        />
        <meta name="keywords" content="cancel booking, refund, travel cancellation, booking management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <CancellationDashboard />
      </main>
    </>
  );
};

export default CancellationPage;