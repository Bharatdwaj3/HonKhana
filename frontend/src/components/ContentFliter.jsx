import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../store/contentSlice';
import { Box, Chip } from '@mui/material';
import { 
  AllInclusive, 
  AutoStories, 
  Science, 
  Palette, 
  Today, 
  History 
} from '@mui/icons-material';

const CATEGORIES = [
  { value: 'all', label: 'All Stories', icon: <AllInclusive /> },
  { value: 'fiction', label: 'Fiction', icon: <AutoStories /> },
  { value: 'science', label: 'Science', icon: <Science /> },
  { value: 'art', label: 'Art', icon: <Palette /> },
  { value: 'daily', label: 'Daily', icon: <Today /> },
  { value: 'history', label: 'History', icon: <History /> },
];

export default function CategoryFilter() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.content.selectedCategory);

  const handleCategoryClick = (category) => {
    dispatch(setCategory(category));
  };

  return (
    <Box 
      className="glass-strong"
      sx={{ 
        padding: '24px 40px',
        borderRadius: '16px',
        marginBottom: '32px',
        position: 'sticky',
        top: '80px',
        zIndex: 10,
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat.value}
            icon={cat.icon}
            label={cat.label}
            onClick={() => handleCategoryClick(cat.value)}
            sx={{
              fontSize: '0.95rem',
              padding: '24px 12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: selectedCategory === cat.value 
                ? 'var(--color-primary)' 
                : 'var(--color-secondary)',
              color: selectedCategory === cat.value 
                ? 'var(--color-primary-foreground)' 
                : 'var(--color-foreground)',
              border: selectedCategory === cat.value 
                ? '2px solid var(--color-primary)' 
                : '1px solid var(--color-border)',
              '&:hover': {
                backgroundColor: selectedCategory === cat.value 
                  ? 'var(--color-primary)' 
                  : 'var(--color-muted)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(32, 178, 166, 0.2)',
              },
              '& .MuiChip-icon': {
                color: 'inherit',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}