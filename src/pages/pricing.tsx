import { NextPage } from 'next';
import Head from 'next/head';
import PricingDashboard from '../components/Pricing/PricingDashboard';

const PricingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dynamic Pricing Engine | MakeMyTrip</title>
        <meta 
          name="description" 
          content="Experience intelligent dynamic pricing with demand-based adjustments, price history tracking, and price freeze protection." 
        />
        <meta name="keywords" content="dynamic pricing, price freeze, demand pricing, travel pricing, price history" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <PricingDashboard />
      </main>
    </>
  );
};

export default PricingPage;