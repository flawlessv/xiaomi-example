import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import VirtualListPage from './pages/VirtualList';
import CSSSelectorsPage from './pages/CSSSelectors';
import { routesConfig } from './routes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <MainLayout routes={routesConfig}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/virtual-list" component={VirtualListPage} />
          <Route path="/css-selectors" component={CSSSelectorsPage} />
          <Route path="/about" component={About} />
          {/* 在这里添加更多路由 */}
        </Switch>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
