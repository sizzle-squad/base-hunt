import dynamic from 'next/dynamic';

const PageClient = dynamic(() => import('./page-client'), {
  suspense: true,
});

export default async function Page() {
  // This is a hack to make sure we show loading skeleton for at least .2 seconds
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return <PageClient />;
}
