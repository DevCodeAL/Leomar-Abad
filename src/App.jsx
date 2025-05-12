import { BrowserRouter as Router, Routes, Route } from "react-router";
import Root from "./components/Root";
import CursorFollower from "./components/StyleComponents/CursorFollower";

function App() {

  return (
    <>
     <Router>
      <CursorFollower/>
        <Routes>
          <Route path="/" element={<Root/>}/>
      </Routes> 
    </Router>

    </>
  )
}

export default App;
