const Forbidden = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight mb-3">Access denied</h1>
        <p className="text-foreground/60">You don't have permission to view this page.</p>
      </div>
    </div>
  );
};

export default Forbidden;
