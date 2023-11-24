import './App.css';
import Layout from './Components/Layout/Layout';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      <Layout />
      
    </div>
  );
}

export default App;
