import React, { useEffect, useState } from 'react';
import { BookOpen, X, Search } from 'lucide-react';
import { useLoans } from '../hooks/useLoans';
import { getFacultyList, getStudentList } from '../util/membersApi';
import LoanListItem from '../components/LoanListItem';
import FinesSection from './FinesSection';

const STATUS_LABELS = { fine: 'Fine', borrow: 'Borrow', returned: 'Returned' };
const STATUS_BADGE_STYLES = {
  fine: 'bg-red-500/10 text-red-500 border-red-500/20',
  borrow: 'bg-foreground/5 text-foreground/70 border-border',
  returned: 'bg-green-500/10 text-green-600 border-green-500/20',
};

const splitLoansByStatus = (loans) => ({
  fine: loans.filter((loan) => (loan.fineAmount || 0) > 0),
  borrow: loans.filter((loan) => !loan.returnedAt),
  returned: loans.filter((loan) => loan.returnedAt),
});

// Small reusable section for the student/faculty view — a title plus a
// stacked list of loans, or nothing if that category is empty.
const LabeledLoanList = ({ title, loans, renderLoan }) => {
  if (loans.length === 0) return null;
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground/50 uppercase mb-3">{title}</h3>
      <div className="space-y-4">{loans.map(renderLoan)}</div>
    </div>
  );
};

const buildMemberRows = (facultyList, studentList, loans, isOverdue) => {
  const withRole = [
    ...facultyList.map((p) => ({ ...p, role: 'faculty' })),
    ...studentList.map((p) => ({ ...p, role: 'student' })),
  ];

  return withRole.map((person) => {
    const personLoans = loans.filter((loan) => loan.userId === person.userId);
    return {
      id: person.id,
      userId: person.userId,
      name: `${person.Fname} ${person.Lname}`,
      role: person.role,
      loans: personLoans,
      activeLoans: personLoans.filter((loan) => !loan.returnedAt).length,
      overdue: personLoans.filter(isOverdue).length,
      outstandingFines: personLoans.reduce((sum, loan) => sum + (loan.fineAmount || 0), 0),
    };
  });
};

const StatCard = ({ label, value, danger }) => (
  <div className="bg-card rounded-2xl border border-border p-4">
    <p className="text-xs font-semibold text-foreground/50 uppercase mb-1">{label}</p>
    <p className={`text-2xl font-black ${danger ? 'text-red-500' : ''}`}>{value}</p>
  </div>
);

const CountCell = ({ count, tone }) => {
  if (count === 0) return <span className="text-foreground/40">—</span>;
  const styles = tone === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-foreground/5 text-foreground/70';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles}`}>{count}</span>;
};

const MemberDrawer = ({ member, renderLoan, onClose }) => {
  const [activeStatus, setActiveStatus] = useState(null);
  if (!member) return null;
  const buckets = splitLoansByStatus(member.loans);

  const toggleStatus = (status) => {
    setActiveStatus((current) => (current === status ? null : status));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card h-full overflow-y-auto p-6 border-l border-border">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold">{member.name}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-foreground/5">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-foreground/60 capitalize mb-4">{member.role}</p>

        <div className="flex gap-2 flex-wrap">
          {Object.keys(STATUS_LABELS).map((status) => (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${STATUS_BADGE_STYLES[status]} ${
                activeStatus === status ? 'ring-2 ring-offset-1 ring-primary' : ''
              }`}
            >
              {STATUS_LABELS[status]} · {buckets[status].length}
            </button>
          ))}
        </div>

        {activeStatus && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            {buckets[activeStatus].length === 0 ? (
              <p className="text-sm text-foreground/50">No loans in this category.</p>
            ) : (
              buckets[activeStatus].map(renderLoan)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const MembersTable = ({ rows, onSelect }) => (
  <div className="bg-card rounded-2xl border border-border overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left text-foreground/50 text-xs uppercase">
          <th className="p-4 font-semibold">Member</th>
          <th className="p-4 font-semibold">Role</th>
          <th className="p-4 font-semibold">Active Loans</th>
          <th className="p-4 font-semibold">Overdue</th>
          <th className="p-4 font-semibold">Outstanding Fines</th>
          <th className="p-4 font-semibold"></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="border-b border-border last:border-0 hover:bg-foreground/5">
            <td className="p-4 font-semibold">{row.name}</td>
            <td className="p-4 text-foreground/60 capitalize">{row.role}</td>
            <td className="p-4"><CountCell count={row.activeLoans} /></td>
            <td className="p-4"><CountCell count={row.overdue} tone="danger" /></td>
            <td className="p-4">
              {row.outstandingFines > 0 ? (
                <span className="text-red-500 font-semibold">₹{row.outstandingFines}</span>
              ) : (
                <span className="text-foreground/40">—</span>
              )}
            </td>
            <td className="p-4">
              <button
                onClick={() => onSelect(row)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-foreground/5 border border-border hover:border-primary transition-all"
              >
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const UnresolvedLoansTable = ({ loans, isOverdue, onReturn, returningId, onWaiveFine, waivingFineForLoanId }) => {
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
          No {tab === 'active' ? 'active' : 'returned'} orphaned loans.
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-foreground/50 text-xs uppercase">
                <th className="p-4 font-semibold">Book</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Fine</th>
                <th className="p-4 font-semibold"></th>
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
                        <span className="text-foreground/60">Checked out</span>
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
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-all disabled:opacity-50"
                          >
                            {returningId === loan.id ? 'Returning...' : 'Return'}
                          </button>
                        )}
                        {loan.fineAmount > 0 && (
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
    handleWaiveFine,
    waivingFineForLoanId,
    waiveFineError,
  } = useLoans(isAdmin);

  const [facultyList, setFacultyList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [directoryLoading, setDirectoryLoading] = useState(isAdmin);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    const loadDirectory = async () => {
      setDirectoryLoading(true);
      try {
        const [facultyRes, studentRes] = await Promise.all([getFacultyList(), getStudentList()]);
        setFacultyList(facultyRes.data);
        setStudentList(studentRes.data);
      } catch {
      } finally {
        setDirectoryLoading(false);
      }
    };
    loadDirectory();
  }, [isAdmin]);

  if (loading || (isAdmin && directoryLoading)) {
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

  if (!isAdmin) {
    return (
      <div>
        {error && <p className="text-sm text-primary mb-6">{error}</p>}
        {returnError && <p className="text-sm text-primary mb-6">{returnError}</p>}
        {payFineError && <p className="text-sm text-red-500 mb-6">{payFineError}</p>}
        <FinesSection />
        {loans.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center text-foreground/60">
            <BookOpen size={32} className="mx-auto mb-3 text-foreground/20" />
            No loans yet.
          </div>
        ) : (
          (() => {
            const { fine, borrow, returned } = splitLoansByStatus(loans);
            return (
              <div>
                <LabeledLoanList title="Fines" loans={fine} renderLoan={renderLoanItem} />
                <LabeledLoanList title="Currently Borrowed" loans={borrow} renderLoan={renderLoanItem} />
                <LabeledLoanList title="Returned" loans={returned} renderLoan={renderLoanItem} />
              </div>
            );
          })()
        )}
      </div>
    );
  }

  const allRows = buildMemberRows(facultyList, studentList, loans, isOverdue);
  const directoryUserIds = new Set(allRows.map((row) => row.userId).filter(Boolean));
  const unresolvedLoans = loans.filter((loan) => !directoryUserIds.has(loan.userId));

  const visibleRows = allRows.filter((row) => {
    const matchesRole = roleFilter === 'all' || row.role === roleFilter;
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const activeLoanCount = loans.filter((loan) => !loan.returnedAt).length;
  const overdueCount = loans.filter(isOverdue).length;
  const totalMembers = facultyList.length + studentList.length;

  return (
    <div>
      {error && <p className="text-sm text-primary mb-6">{error}</p>}
      {returnError && <p className="text-sm text-primary mb-6">{returnError}</p>}
      {payFineError && <p className="text-sm text-red-500 mb-6">{payFineError}</p>}
      {waiveFineError && <p className="text-sm text-red-500 mb-6">{waiveFineError}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active Loans" value={activeLoanCount} />
        <StatCard label="Overdue Items" value={overdueCount} danger={overdueCount > 0} />
        <StatCard label="Unpaid Fines" value={`₹${totalFinesOwed}`} danger={totalFinesOwed > 0} />
        <StatCard label="Total Members" value={totalMembers} />
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-foreground/5 border border-border rounded-xl flex-1 min-w-[200px]">
          <Search size={18} className="text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by member name..."
            className="bg-transparent text-sm text-foreground placeholder:text-foreground/40 focus:outline-none flex-grow"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'faculty', 'student'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                roleFilter === role
                  ? 'bg-primary text-white border-primary'
                  : 'bg-foreground/5 border-border text-foreground/70'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {visibleRows.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center text-foreground/60">
          <BookOpen size={32} className="mx-auto mb-3 text-foreground/20" />
          No members match this search.
        </div>
      ) : (
        <MembersTable rows={visibleRows} onSelect={setSelectedMember} />
      )}

      {unresolvedLoans.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-1">Unresolved Loans</h3>
          <p className="text-sm text-foreground/50 mb-3">
            These loans reference a user not found in the current directory.
          </p>
          <UnresolvedLoansTable
            loans={unresolvedLoans}
            isOverdue={isOverdue}
            onReturn={handleReturn}
            returningId={returningId}
            onWaiveFine={handleWaiveFine}
            waivingFineForLoanId={waivingFineForLoanId}
          />
        </div>
      )}

      <MemberDrawer member={selectedMember} renderLoan={renderLoanItem} onClose={() => setSelectedMember(null)} />
    </div>
  );
};
export default LoansSection;
