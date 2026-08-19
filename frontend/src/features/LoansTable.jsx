import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

const LoansTable = ({
  loans,
  isOverdue,
  onReturn,
  returningId,
  onRenew,
  renewingId,
  onWaiveFine,
  waivingFineForLoanId,
  checkedOutLabel = 'Borrowed',
  emptyNoun = 'loans',
}) => {
  const [tab, setTab] = useState('active');
  const activeLoans = loans.filter((loan) => !loan.returnedAt);
  const historyLoans = loans.filter((loan) => loan.returnedAt);
  const unsortedVisibleLoans = tab === 'active' ? activeLoans : historyLoans;

  const visibleLoans = [...unsortedVisibleLoans].sort((a, b) => {
    const aGroup = isOverdue(a) ? 0 : 1;
    const bGroup = isOverdue(b) ? 0 : 1;
    if (aGroup !== bGroup) return aGroup - bGroup;
    return new Date(a.dueAt) - new Date(b.dueAt);
  });

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {['active', 'history'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              tab === t ? 'bg-foreground/10 text-foreground' : 'text-foreground/50 hover:text-foreground'
            }`}
          >
            {t} ({t === 'active' ? activeLoans.length : historyLoans.length})
          </button>
        ))}
      </div>

      {visibleLoans.length === 0 ? (
        <div className="bg-card rounded-2xl border p-8 text-center text-foreground/50 text-sm">
          No {tab === 'active' ? 'active' : 'returned'} {emptyNoun}.
        </div>
      ) : (
        <div className="bg-card rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-foreground/50 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Cover</th>
                <th className="p-4">Book</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Fine</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {visibleLoans.map((loan) => {
                const overdue = isOverdue(loan);
                const canRenew = !loan.returnedAt && !overdue && loan.renewalCount < 2;
                return (
                  <tr key={loan.id} className="border-b last:border-0 hover:bg-foreground/5">
                    <td className="p-4">
                      <div className="w-10 h-14 rounded bg-foreground/5 overflow-hidden flex">
                        {loan.book?.coverUrl ? (
                          <img src={loan.book.coverUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <BookOpen size={16} className="m-auto text-foreground/20" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-semibold">{loan.book?.title}</td>
                    <td className="p-4 text-foreground/60">{new Date(loan.dueAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      {loan.returnedAt ? (
                        <span className="text-green-600 font-medium">Returned</span>
                      ) : (
                        <span className={overdue ? 'text-red-500 font-bold' : 'text-foreground/60'}>
                          {overdue ? 'Overdue' : checkedOutLabel}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-red-500">
                      {loan.fineAmount > 0 ? `₹${loan.fineAmount}` : '—'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        {canRenew && onRenew && (
                          <button
                            onClick={() => onRenew(loan.id)}
                            disabled={renewingId === loan.id}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50"
                          >
                            {renewingId === loan.id ? '...' : 'Renew'}
                          </button>
                        )}
                        {!loan.returnedAt && (
                          <button
                            onClick={() => onReturn(loan.id)}
                            disabled={returningId === loan.id}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-border hover:border-primary hover:text-primary disabled:opacity-50"
                          >
                            {returningId === loan.id ? '...' : 'Return'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoansTable;
