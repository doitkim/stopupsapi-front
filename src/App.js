import Footer from "./Pages/Footer";
import { Header } from "./Pages/Header";
import LoginPage from "./Pages/Login";
import AppRouter from "./routes/router";

function App() {
  return (
    <div className="App">
      <Header />
      <AppRouter>
        <LoginPage />
      </AppRouter>
      <Footer />
    </div>
  );
}

export default App;
