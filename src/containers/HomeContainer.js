/**
 * Created by Ash on 2016-06-06.
 */


import React, { Component, PropTypes } from 'react';
import Link from 'react-router/lib/Link';


export default class HomeContainer extends Component {

	static propTypes = {
		children: PropTypes.node,
		user: PropTypes.arrayOf(PropTypes.object)
	};

	render() {

		return (
			<div>
				<header className="site-header">
					<a href="/" className="site-header-logo">Loyalty</a>
					<nav className="site-nav">
						<Link to="/dashboard" activeClassName="active">Dashboard</Link>
						<Link to="/iteration" activeClassName="active">Iteration</Link>
					</nav>
				</header>

				{this.props.children}
			</div>
		);
	}
}
