import './App.css';
import { PlaybackProvider } from './PlaybackContext';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <div className="App">
      <PlaybackProvider>
        <LandingPage/>
      </PlaybackProvider>
    </div>
  );
}

export default App;
