import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight mb-3">Please log in</h1>
        <p className="text-foreground/60 mb-6">You need to be logged in to view this page.</p>
        <Link
          to="/login"
          className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all"
        >
          Go to login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
