'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

async function fetchTestData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function TestComponent() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['testData'],
    queryFn: fetchTestData,
  });

  return (
    <div className="p-6 border rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Test Component</h2>

      <Button onClick={() => refetch()} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </Button>

      {isLoading && <p>Loading data...</p>}

      {error && <p className="text-red-500">Error: {error.message}</p>}

      {data && (
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Data from API:</h3>
          <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
