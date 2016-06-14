/**
 * Created by Ash on 2016-06-06.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';

import LoginContainer from './LoginContainer';

import UserActions from '../actions/UserActions';


@connect(state => ({
  user: state.user
}))
export default class HomeContainer extends Component {

	static propTypes = {
		children: PropTypes.node,
		dispatch: PropTypes.func,
		user: PropTypes.object
	};

  logout() {
    this.props.dispatch(UserActions.logout());
  }

	render() {

		return (
			this.props.user.login
        ? <div>
            <header className="site-header">
              <a href="/" className="site-header-logo">Loyalty</a>
              <nav className="site-nav">
                <Link to="dashboard" activeClassName="active">Dashboard</Link>
                <Link to="iteration" activeClassName="active">Iteration</Link>
              </nav>
              <a className="site-logout" onClick={::this.logout}>Logout</a>
            </header>

            {this.props.children}
          </div>
        : <LoginContainer />
		);
	}
}
