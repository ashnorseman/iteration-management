/**
 * Created by AshZhang on 2016-4-8.
 */


import 'desktop-css-starter';
import './styles/app.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import hashHistory from 'react-router/lib/hashHistory';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import createStore from 'redux/lib/createStore';
import applyMiddleware from 'redux/lib/applyMiddleware';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import fetchie from 'fetchie';

import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';

import reducers from './reducers';

import HomeContainer from './containers/HomeContainer';
import DashboardContainer from './containers/DashboardContainer';
import IterationContainer from './containers/IterationContainer';
import IterationItemContainer from './containers/IterationItemContainer';
import PrintContainer from './containers/PrintContainer';

import IterationActions from './actions/IterationActions';
import UserActions from './actions/UserActions';


const store = applyMiddleware(thunkMiddleware)(createStore)(reducers);

fetchie
  .use(function () {
    this.timeout(100000);
  });


Promise.all([
	store.dispatch(UserActions.fetchUserList()),
	store.dispatch(IterationActions.fetchIterationList())
])
	.then(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      store.dispatch(UserActions.readFromLocal(user));
    }

		ReactDOM.render((
			<Provider store={store}>
				<Router history={hashHistory}>
					<Route path="/" component={HomeContainer}>
            <IndexRedirect to="dashboard" />
						<Route name="dashboard" path="dashboard" component={DashboardContainer} />
						<Route name="iteration" path="iteration" component={IterationContainer} />
						<Route name="iteration.item" path="iteration/:id" component={IterationItemContainer} />
					</Route>
          <Route path="/print/:id" component={PrintContainer} />
        </Router>
			</Provider>
		), document.getElementById('app'));
	});
