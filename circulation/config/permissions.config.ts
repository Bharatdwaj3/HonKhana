const PERMISSIONS: Record<string, string[]> = {
  admin: ['listLoan', 'viewLoan', 'borrowBook', 'returnBook', 'forceReturnBook', 'issueFine'],
  faculty: ['borrowBook', 'returnBook', 'viewLoan', 'payFine'],
  student: ['borrowBook', 'returnBook', 'viewLoan', 'payFine'],
};

export default PERMISSIONS;
