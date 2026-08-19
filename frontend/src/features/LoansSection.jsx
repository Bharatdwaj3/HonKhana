import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useMemberDirectory } from '../hooks/useMemberDirectory';
import { buildMemberRows } from '../util/buildMemberRows';
import LoanListItem from '../components/LoanListItem';
import StatCard from '../components/StatCard';
import LoansTable from './LoansTable';
import MembersTable from './MembersTable';
import MemberDrawer from './MemberDrawer';
import MemberSearchFilter from './MemberSearchFilter';
import FinesSection from './FinesSection';

const LoansSection = ({
  isAdmin,
  loans,
  loading,
  error,
  returnError,
  returningId,
  handleReturn,
  handleRenew,
  renewingId,
  isOverdue,
  totalFinesOwed,
  handlePayFine,
  payingFineForLoanId,
  payFineError,
  handleWaiveFine,
  waivingFineForLoanId,
  waiveFineError,
}) => {
  const { facultyList, studentList, directoryLoading } = useMemberDirectory(isAdmin);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

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
        <LoansTable 
          loans={loans} 
          isOverdue={isOverdue} 
          onReturn={handleReturn} 
          returningId={returningId} 
          onRenew={handleRenew} 
          renewingId={renewingId} 
        />
        <div className="mt-8">
          <FinesSection />
        </div>
      </div>
    );
  }

  const allRows = buildMemberRows(facultyList, studentList, loans, isOverdue);
  const directoryUserIds = new Set(allRows.map((row) => row.userId).filter(Boolean));
  const unresolvedLoans = loans.filter((loan) => !directoryUserIds.has(loan.userId));

  const visibleRows = allRows.filter((row) => {
    const matchesRole = roleFilter === 'all' || row.role === roleFilter;
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOverdue = !showOverdueOnly || row.overdue > 0;
    return matchesRole && matchesSearch && matchesOverdue;
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
        <StatCard
          label="Overdue Items"
          value={overdueCount}
          danger={overdueCount > 0}
          onClick={() => setShowOverdueOnly((prev) => !prev)}
          active={showOverdueOnly}
        />
        <StatCard label="Unpaid Fines" value={`₹${totalFinesOwed}`} danger={totalFinesOwed > 0} />
        <StatCard label="Total Members" value={totalMembers} />
      </div>

      <MemberSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

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
          <LoansTable
            loans={unresolvedLoans}
            isOverdue={isOverdue}
            onReturn={handleReturn}
            returningId={returningId}
            onRenew={handleRenew}
            renewingId={renewingId}
            onWaiveFine={handleWaiveFine}
            waivingFineForLoanId={waivingFineForLoanId}
            checkedOutLabel="Checked out"
            emptyNoun="orphaned loans"
          />
        </div>
      )}

      <MemberDrawer member={selectedMember} renderLoan={renderLoanItem} onClose={() => setSelectedMember(null)} />
    </div>
  );
};

export default LoansSection;
