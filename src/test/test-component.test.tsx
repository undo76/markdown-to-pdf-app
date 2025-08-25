import { render, screen } from '@testing-library/react';
import { TestComponent } from '@/components/test-component';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('TestComponent', () => {
  it('renders the component with title and button', async () => {
    render(<TestComponent />, { wrapper });

    expect(screen.getByText('Test Component')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /fetch data/i })
    ).toBeInTheDocument();
  });
});
