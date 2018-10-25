import {Component} from 'react';
import {Router} from 'react-router';
import routes from '../routes';

class App extends Component {
  render() {
    const { history, store }: Readonly<{ children?: React.ReactNode }> & Readonly<P> = this.props;
    return (
      <Router routes={routes(store)} history={history} />
    );
  }
}

App.propTypes = {
  history: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired
};

export default App;
