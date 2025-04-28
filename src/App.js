import logo from './tazadeCafe.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p><strong>“A quien madruga, un buen café le ayuda”</strong></p>
        <a
          className="App-link"
          href="https://noro.mx/hermosillo/7-cafes-en-hermosillo-para-hacer-home-office/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Más información
        </a>
      </header>
    </div>
  );
}

export default App;