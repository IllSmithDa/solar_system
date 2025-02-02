/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home/Home";

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        < Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;