import { Header } from './components/Header';
import { BlogsPage } from './pages/BlogsPage';
import './index.css';
import './App.css';

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Header />
      <BlogsPage />
    </div>
  );
}