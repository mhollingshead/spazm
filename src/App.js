import './App.scss';
import UserProvider from './contexts/UserProvider';
import Streams from './components/Streams';

function App() {
  return (
    <div className="app">
      <UserProvider>
        <Streams />
      </UserProvider>
    </div>
  );
}

export default App;
