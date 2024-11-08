import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SubjectListPage from './pages/SubjectList.page';
import PostPage from './pages/PostPage';
import AdminPage from './pages/Admin/Admin.page';
import NotFound from './pages/NotFound';
import './global.css';
import { DeviceTypeProvider } from './contexts/DeviceTypeContext';

function App() {
  return (
    <DeviceTypeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* TODO param을 옵션으로 받는 더 좋은 방법? */}
          <Route path="list" element={<SubjectListPage />}>
            <Route path=":pageNum" element={<SubjectListPage />} />
          </Route>
          <Route path="admin" element={<AdminPage />} />
          <Route path="post">
            <Route path=":id" element={<PostPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DeviceTypeProvider>
  );
}

export default App;
