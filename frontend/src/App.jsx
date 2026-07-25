
import {Home, Explore, NewStory} from "./pages/index";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import {Login, Signup} from "./auth/index";
import {Navbar} from "./components/index";

import  {   
     ContentGrid, ContentDetails, ContentTab, 
    ReaderProfile,
    WriterProfile
} from "./features/index";

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {

  return (
    <>
      <Router>
            <Navbar/>
          <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/complete-profile" element={<CompleteProfile/>}/>

              <Route path="/content" element={<ContentGrid/>}/>
              <Route path="/my-stories" element={<ContentGrid />} />
              <Route path="/content/:id" element={<ContentDetails/>}/>
              <Route path="/content/crud" element={<ContentTab/>}/>
              <Route path="/explore" element={<Explore />} />

              <Route path="/reader" element={<ReaderProfile />} />
              <Route path="/writer" element={<WriterProfile />} />
              <Route path="/writer/new" element={<NewStory />} />
              
            
          </Routes>
        </Router>
    </>
  )
}

export default App
