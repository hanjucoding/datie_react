import { Routes, Route } from "react-router-dom";
import Paypassword from "./component/pay/Paypassword";

function App() {
  return (
    <Routes>
      <Route path="/pay/paypassword" element={<Paypassword />} />
    </Routes>
  );
}

export default App;

//gd
