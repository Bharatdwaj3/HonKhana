import React, { useState } from 'react';

// Shared Active/History loans table, used both for a signed-in user's own
// loans and for admin's unresolved-loans view. Pass `onWaiveFine` to show
// the admin-only Waive Fine action; omit it for the non-admin view.
const LoansTable = ({
  loans,
  isOverdue,
  onReturn,
  returningId,
  onWaiveFine,
  waivingFineForLoanId,
  checkedOutLabel = 'Borrowed',
  emptyNoun = 'loans',
}) => {
  const [tab, setTab] = useState('active');
  const activeLoans = loans.filter((loan) => !loan.returnedAt);
  const historyLoans = loans.filter((loan) => loan.returnedAt);
  const visibleLoans = tab === 'active' ? activeLoans : historyLoans;

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setTab('active')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'active' ? 'bg-foreground/10 text-foreground' : 'text-foreground/50 hover:text-foreground'
          }`}
        >
          Active ({activeLoans.length})
        </button>
        <button
          onClick={() => setTab('history')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            tab === 'history' ? 'bg-foreground/10 text-foreground' : 'text-foreground/50 hover:text-foreground'
          }`}
        >
          History ({historyLoans.length})
        </button>
      </div>

      {visibleLoans.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center text-foreground/50 text-sm">
          No {tab === 'active' ? 'active' : 'returned'} {emptyNoun}.
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-foreground/50 text-sm font-semibold uppercase tracking-wide">
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
                return (
                  <tr key={loan.id} className="border-b border-border last:border-0 hover:bg-foreground/5">
                    <td className="p-4 font-semibold">{loan.book?.title ?? `Book #${loan.bookId}`}</td>
                    <td className="p-4 text-foreground/60">{new Date(loan.dueAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      {loan.returnedAt ? (
                        <span className="text-green-600">Returned</span>
                      ) : overdue ? (
                        <span className="text-red-500">Overdue</span>
                      ) : (
                        <span className="text-foreground/60">{checkedOutLabel}</span>
                      )}
                    </td>
                    <td className="p-4">
                      {loan.fineAmount > 0 ? (
                        <span className="text-red-500 font-semibold">₹{loan.fineAmount}</span>
                      ) : (
                        <span className="text-foreground/40">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        {!loan.returnedAt && (
                          <button
                            onClick={() => onReturn(loan.id)}
                            disabled={returningId === loan.id}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-border text-foreground/70 hover:border-primary hover:text-primary transition-all disabled:opacity-50"
                          >
                            {returningId === loan.id ? 'Returning...' : 'Return'}
                          </button>
                        )}
                        {onWaiveFine && loan.fineAmount > 0 && (
                          <button
                            onClick={() => onWaiveFine(loan.id)}
                            disabled={waivingFineForLoanId === loan.id}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-foreground/5 border border-border hover:border-primary transition-all disabled:opacity-50"
                          >
                            {waivingFineForLoanId === loan.id ? 'Waiving...' : 'Waive Fine'}
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
