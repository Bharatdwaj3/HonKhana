
import {Home, Explore, NewStory} from "./pages/index";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Forbidden from "./pages/Forbidden";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import {Login, Signup} from "./auth/index";
import {Navbar} from "./components/index";

import  {   
     ContentGrid, ContentDetails, ContentTab, 
    MemberProfile,
    StaffProfile
} from "./features/index";

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {

  return (
    <>
      <ErrorBoundary>
      <Router>
            <Navbar/>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/profile" element={<ProtectedRoute path="/profile"><Profile/></ProtectedRoute>}/>
              <Route path="/complete-profile" element={<ProtectedRoute path="/complete-profile"><CompleteProfile/></ProtectedRoute>}/>

              <Route path="/content" element={<ContentGrid/>}/>
              <Route path="/my-stories" element={<ContentGrid />} />
              <Route path="/content/:id" element={<ContentDetails/>}/>
              <Route path="/content/crud" element={<ProtectedRoute path="/content/crud"><ContentTab/></ProtectedRoute>}/>
              <Route path="/explore" element={<Explore />} />

              <Route path="/member" element={<ProtectedRoute path="/member"><MemberProfile /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute path="/staff"><StaffProfile /></ProtectedRoute>} />
              <Route path="/staff/new" element={<ProtectedRoute path="/staff/new"><NewStory /></ProtectedRoute>} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
              
            
          </Routes>
        </Router>
      </ErrorBoundary>
    </>
  )
}

export default App
