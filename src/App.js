import './App.css';
import MintToken from './MintToken';
import MintNft from './MintNft';
import SendSol from './SendSol';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MintToken />
        <br />
        <MintNft />
        <br />
        <SendSol />
      </header>
    </div>
  );
}

export default App;
