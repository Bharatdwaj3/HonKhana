import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useFines } from '../hooks/useFines';
import FineListItem from '../components/FineListItem';

const FinesSection = () => {
  const { fines, loading, error, payingId, payError, handlePay, totalUnpaid } = useFines();

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
      {payError && <p className="text-sm text-red-500 mb-6">{payError}</p>}

      {totalUnpaid > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <span className="text-sm font-semibold text-red-500">Total Unpaid Fines</span>
          <span className="text-lg font-black text-red-500">₹{totalUnpaid}</span>
        </div>
      )}

      {fines.length > 0 && (
        <div className="space-y-4">
          {fines.map((fine) => (
            <FineListItem
              key={fine.id}
              fine={fine}
              paying={payingId === fine.id}
              onPay={handlePay}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FinesSection;
