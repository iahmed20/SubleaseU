import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home.js';
import PostListing from './PostListing.js';
import Messages from './Messages.js';  // Make sure to import the Messages component

function App() {
    return (
        <div className="App">
          <Router>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/post-listing' element={<PostListing />} />
              <Route path='/messages' element={<Messages />} /> {/* Add route for Messages component */}
            </Routes>
          </Router>
        </div>
    );
}
export default App;
