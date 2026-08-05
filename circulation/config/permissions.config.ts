const PERMISSIONS: Record<string, string[]> = {
  admin: ['listLoan', 'viewLoan', 'borrowBook', 'returnBook', 'forceReturnBook', 'issueFine'],
  faculty: ['borrowBook', 'returnBook', 'viewLoan'],
  student: ['borrowBook', 'returnBook', 'viewLoan'],
};

export default PERMISSIONS;
