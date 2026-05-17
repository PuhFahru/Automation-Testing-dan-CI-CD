import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelect,
  searchQuery,
  onSearchChange,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const handleClear = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Cari thread..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {localSearch && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filter kategori:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            selectedCategory === null
              ? 'bg-primary text-primary-foreground shadow-md scale-105'
              : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
          )}
        >
          Semua
          <span className="ml-1.5 text-xs opacity-70">({categories.length})</span>
        </button>
        {categories.map((cat, index) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 animate-fade-in',
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground shadow-md scale-105'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;