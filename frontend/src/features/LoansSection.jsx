import React from 'react';
import { BookOpen } from 'lucide-react';
import { useLoans } from '../hooks/useLoans';
import LoanListItem from '../components/LoanListItem';
import FinesSection from './FinesSection';

const LoansSection = ({ isAdmin }) => {
  const {
    loans,
    loading,
    error,
    returnError,
    returningId,
    handleReturn,
    isOverdue,
    totalFinesOwed,
  } = useLoans(isAdmin);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {error && <p className="text-sm text-primary mb-6">{error}</p>}
      {returnError && <p className="text-sm text-primary mb-6">{returnError}</p>}

      {totalFinesOwed > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-red-500">Total Fines Owed</span>
          <span className="text-lg font-black text-red-500">₹{totalFinesOwed}</span>
        </div>
      )}

      {!isAdmin && <FinesSection />}

      {loans.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center text-foreground/60">
          <BookOpen size={32} className="mx-auto mb-3 text-foreground/20" />
          No loans yet.
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <LoanListItem
              key={loan.id}
              loan={loan}
              overdue={isOverdue(loan)}
              returning={returningId === loan.id}
              onReturn={handleReturn}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LoansSection;
