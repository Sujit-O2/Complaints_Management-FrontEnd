import { Routes, Route} from "react-router-dom";
import Auth from "./Auth/Auth";
import Display from "./DisplayPage";
import StudentDashboard from "./DashBoard/StudentDashBoard";
import AdminSignupPage from "./Auth/AdminSignUp";
import AdminDashboard from "./DashBoard/AdminDashBoard";


function App() {

  return (
    <Routes>
      <Route path="/" element={<Display/>} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin02/admin" element={<AdminSignupPage/>}/>
      <Route
        path="/dashboard"
        element={<StudentDashboard/>
          
        }
      />
      <Route
        path="/admindashboard"
        element={<AdminDashboard/>
          
        }
      />
    </Routes>
  );
}

export default App;
