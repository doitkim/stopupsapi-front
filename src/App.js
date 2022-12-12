import LoginPage from "./Pages/Login";
import AppRouter from "./routes/router";

function App() {
  return (
    <div className="App">
      <AppRouter>
        <LoginPage />
      </AppRouter>
    </div>
  );
}

export default App;
