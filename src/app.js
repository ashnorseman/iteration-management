/**
 * Created by AshZhang on 2016-4-8.
 */


import 'desktop-css-starter';
import './styles/app.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import hashHistory from 'react-router/lib/hashHistory';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRedirect from 'react-router/lib/IndexRedirect';
import createStore from 'redux/lib/createStore';
import applyMiddleware from 'redux/lib/applyMiddleware';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers';

import HomeContainer from './containers/HomeContainer';
import DashboardContainer from './containers/DashboardContainer';
import IterationContainer from './containers/IterationContainer';
import IterationItemContainer from './containers/IterationItemContainer';

import IterationActions from './actions/IterationActions';
import UserActions from './actions/UserActions';


const store = applyMiddleware(thunkMiddleware)(createStore)(reducers);

Promise.all([
	store.dispatch(UserActions.fetchUserList()),
	store.dispatch(IterationActions.fetchIterationList())
])
	.then(() => {

		ReactDOM.render((
			<Provider store={store}>
				<Router history={hashHistory}>
					<Route path="/" component={HomeContainer}>
						<IndexRedirect to="/iteration" />
						<Route path="/dashboard" component={DashboardContainer} />
						<Route path="/iteration" component={IterationContainer} />
						<Route path="/iteration/:id" component={IterationItemContainer} />
					</Route>
				</Router>
			</Provider>
		), document.getElementById('app'));
	});
