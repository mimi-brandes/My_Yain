// import React from 'react';
// import Home from './components/Home.jsx';


// function App() {
//   // return <Home />;
//   <Router>
//   <Routes>
//     <Route path="/" element={<Home />} />
//     <Route path="/signup" element={<Signup />} />
//     <Route path="/login" element={<Login />} />
//   </Routes>
// </Router>
// }

// export default App;
// App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
function App() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
export default App;
