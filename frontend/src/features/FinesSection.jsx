import React from 'react';
import { useFines } from '../hooks/useFines';

const FinesTable = ({ fines, payingId, onPay }) => {
  if (fines.length === 0) return <div className="bg-card rounded-2xl border p-8 text-center text-foreground/50 text-sm">No fines.</div>;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-foreground/50 text-sm font-semibold uppercase tracking-wide">
            <th className="p-4">Reason</th>
            <th className="p-4">Date</th>
            <th className="p-4">Status</th>
            <th className="p-4">Amount</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {fines.map((fine) => (
            <tr key={fine.id} className="border-b border-border last:border-0 hover:bg-foreground/5">
              <td className="p-4 font-semibold">{fine.reason}</td>
              <td className="p-4 text-foreground/60">{new Date(fine.createdAt).toLocaleDateString()}</td>
              <td className="p-4">{fine.paid ? <span className="text-green-600">Paid</span> : <span className="text-red-500">Unpaid</span>}</td>
              <td className="p-4"><span className={fine.paid ? 'text-foreground/60' : 'text-red-500 font-semibold'}>₹{fine.amount}</span></td>
              <td className="p-4">
                {!fine.paid && (
                  <div className="flex justify-end">
                    <button onClick={() => onPay(fine)} disabled={payingId === fine.id} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50">
                      {payingId === fine.id ? '...' : 'Pay'}
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FinesSection = () => {
  const { fines, loading, error, payingId, payError, handlePay, totalUnpaid } = useFines();

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Fines & Fee Ledger</h2>
        {totalUnpaid > 0 && (
          <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Balance Due: ₹{totalUnpaid}</span>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-primary mb-6">{error}</p>}
      {payError && <p className="text-sm text-red-500 mb-6">{payError}</p>}
      <FinesTable fines={fines} payingId={payingId} onPay={handlePay} />
    </div>
  );
};

export default FinesSection;
