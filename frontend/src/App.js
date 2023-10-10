import { useRoutes, useNavigate } from "react-router-dom";
import { WorkerThemeRoutes, ThemeRoutes, UnAuthorizedRoutes} from "./routes/Router";
import {useEffect, useState} from "react";

const App = () => {
  const navigate = useNavigate();
  const routing = useRoutes(ThemeRoutes);
  const routing1 = useRoutes(WorkerThemeRoutes);
  const routing2 = useRoutes(UnAuthorizedRoutes);
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const [route, setRoute] = useState(routing2)


  useEffect(() => {

    if (token && user) {
      console.log(user.role)
    } else {

    }
    console.log(token, user)
  }, [user, token])

  if (token && user) {
    if (user.role === 'admin') {
      return <div className="dark">{routing}</div>;
    } else {
      return <div className="dark">{routing1}</div>;
    }
  }

  return <div className="dark">{routing2}</div>;
};

export default App;
