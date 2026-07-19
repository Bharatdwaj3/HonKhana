const PERMISSIONS: Record<string, string[]> = {
  admin: ['listLoan', 'viewLoan', 'borrowBook', 'returnBook', 'forceReturnBook'],
  faculty: ['borrowBook', 'returnBook', 'viewLoan'],
  student: ['borrowBook', 'returnBook', 'viewLoan'],
};

export default PERMISSIONS;