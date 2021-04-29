import './App.css';
import { HashRouter ,withRouter,Route,Redirect,Switch} from 'react-router-dom';
import Login from './views/login/Login';
import Main from './views/main/Main'
import AuthRouter from './views/authRouter/AuthRouter';


function App() {
  return (
      <HashRouter>
        <Switch>
          <Route path="/" exact component={Login}/>
          <Route path="/login" component={Login}/>
          <AuthRouter path="/main"  component={Main}/>
        </Switch>
      </HashRouter>
  );
}

export default App;
