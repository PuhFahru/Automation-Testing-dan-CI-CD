/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from './CategoryFilter';

describe('CategoryFilter component', () => {
  const mockCategories = ['React', 'TypeScript', 'Testing'];

  it('should render correctly with categories', () => {
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory={null}
        onSelect={vi.fn()}
        searchQuery=""
        onSearchChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Semua/i)).toBeInTheDocument();

    mockCategories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('should handle category selection', async () => {
    const onSelectMock = vi.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory={null}
        onSelect={onSelectMock}
        searchQuery=""
        onSearchChange={vi.fn()}
      />
    );

    const reactButton = screen.getByText('React');
    await userEvent.click(reactButton);

    expect(onSelectMock).toHaveBeenCalledWith('React');
  });

  it('should handle search input change on submit', async () => {
    const onSearchChangeMock = vi.fn();
    render(
      <CategoryFilter
        categories={mockCategories}
        selectedCategory={null}
        onSelect={vi.fn()}
        searchQuery=""
        onSearchChange={onSearchChangeMock}
      />
    );

    const searchInput = screen.getByPlaceholderText('Cari thread...');

    await userEvent.type(searchInput, 'hello world');
    fireEvent.submit(searchInput);

    expect(onSearchChangeMock).toHaveBeenCalledWith('hello world');
  });
});
