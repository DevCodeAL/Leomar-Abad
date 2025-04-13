import { BrowserRouter as Router, Routes, Route } from "react-router";
import Root from "./components/Root";

function App() {

  return (
    <>
     <Router>
        <Routes>
          <Route path="/" element={<Root/>}/>
      </Routes> 
  </Router>

    </>
  )
}

export default App;
