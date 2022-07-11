import './App.css';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Speak from './pages/Speak';
import Topik from './pages/Topik';
import Report from './pages/Report';
import AudioRecord from './pages/AudioRecord';
import AudioRecord2 from './pages/AudioRecord2';
import AudioRecord3 from './pages/AudioRecord3';
import AudioRecord4 from './pages/AudioRecord4';
import AudioRecord5 from './pages/AudioRecord5';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/speak" element={<Speak />} />
        <Route path="/topik" element={<Topik />} />
        <Route path="/report" element={<Report />} />
        <Route path="/audioRecord" element={<AudioRecord />} />
        <Route path="/audioRecord2" element={<AudioRecord2 />} />
        <Route path="/audioRecord3" element={<AudioRecord3 />} />
        <Route path="/audioRecord4" element={<AudioRecord4 />} />
        <Route path="/audioRecord5" element={<AudioRecord5 />} />
      </Routes>
    </>
  );
}

export default App;
