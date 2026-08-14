import React, { useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { useLoans } from '../hooks/useLoans';
import LoanListItem from '../components/LoanListItem';
import FinesSection from './FinesSection';

// Groups admin's "all loans" list into Faculty / Student, then by individual
// user, so admin can scan pending returns per person instead of one long list.
// Loans whose user info couldn't be resolved (members briefly unreachable)
// fall back into "Other" rather than disappearing.
const groupLoansByRoleAndUser = (loans) => {
  const faculty = new Map();
  const student = new Map();
  const other = [];

  for (const loan of loans) {
    const role = loan.user?.role;
    const bucket = role === 'faculty' ? faculty : role === 'student' ? student : null;
    if (!bucket) {
      other.push(loan);
      continue;
    }
    const name = loan.user?.Fname ? `${loan.user.Fname} ${loan.user.Lname}` : loan.user?.email ?? `User #${loan.userId}`;
    if (!bucket.has(loan.userId)) bucket.set(loan.userId, { name, loans: [] });
    bucket.get(loan.userId).loans.push(loan);
  }

  return { faculty: [...faculty.values()], student: [...student.values()], other };
};

// Splits one person's loans into the three status buckets.
// A loan can appear in more than one bucket (e.g. an overdue loan with a
// fine counts under both Fine and Borrow) since these aren't mutually exclusive.
const splitLoansByStatus = (loans) => ({
  fine: loans.filter((loan) => (loan.fineAmount || 0) > 0),
  borrow: loans.filter((loan) => !loan.returnedAt),
  returned: loans.filter((loan) => loan.returnedAt),
});

const LoanStatusGrid = ({ title, loans, renderLoan }) => {
  if (loans.length === 0) return null;
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-foreground/50 uppercase mb-2">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {loans.map(renderLoan)}
      </div>
    </div>
  );
};

// One person's card: collapsed by default, showing just their name and a
// quick status count. Click to expand and reveal the Fine/Borrow/Returned
// grids for that person, same layout as before but hidden until asked for.
const PersonLoanCard = ({ name, loans, renderLoan }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { fine, borrow, returned } = splitLoansByStatus(loans);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between cursor-pointer"
      >
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-sm text-foreground/60">
            {fine.length} Fine · {borrow.length} Borrow · {returned.length} Returned
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`text-foreground/40 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border mt-2">
          <div className="pt-4">
            <LoanStatusGrid title="Fine" loans={fine} renderLoan={renderLoan} />
            <LoanStatusGrid title="Borrow" loans={borrow} renderLoan={renderLoan} />
            <LoanStatusGrid title="Returned" loans={returned} renderLoan={renderLoan} />
          </div>
        </div>
      )}
    </div>
  );
};

const LoanGroup = ({ title, groups, renderLoan }) => {
  if (groups.length === 0) return null;
  return (
    <div>
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="space-y-3">
        {groups.map((group) => (
          <PersonLoanCard key={group.name} name={group.name} loans={group.loans} renderLoan={renderLoan} />
        ))}
      </div>
    </div>
  );
};

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
    handlePayFine,
    payingFineForLoanId,
    payFineError,
  } = useLoans(isAdmin);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderLoanItem = (loan) => (
    <LoanListItem
      key={loan.id}
      loan={loan}
      overdue={isOverdue(loan)}
      returning={returningId === loan.id}
      onReturn={handleReturn}
      payingFine={payingFineForLoanId === loan.id}
      onPayFine={handlePayFine}
      isAdmin={isAdmin}
    />
  );

  const grouped = isAdmin ? groupLoansByRoleAndUser(loans) : null;

  return (
    <div>
      {error && <p className="text-sm text-primary mb-6">{error}</p>}
      {returnError && <p className="text-sm text-primary mb-6">{returnError}</p>}
      {payFineError && <p className="text-sm text-red-500 mb-6">{payFineError}</p>}
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
      ) : isAdmin ? (
        <div className="space-y-8">
          <LoanGroup title="Faculty" groups={grouped.faculty} renderLoan={renderLoanItem} />
          <LoanGroup title="Students" groups={grouped.student} renderLoan={renderLoanItem} />
          {grouped.other.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Other</h3>
              <div className="space-y-4">{grouped.other.map(renderLoanItem)}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">{loans.map(renderLoanItem)}</div>
      )}
    </div>
  );
};
export default LoansSection;
