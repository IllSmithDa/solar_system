/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home/Home";

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route>
          <Route path="/" element={<Home />}/>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;