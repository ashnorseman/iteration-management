/**
 * Created by Ash on 2016-06-06.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


@connect(state => ({
	user: state.user
}))
export default class IterationContainer extends Component {

	static propTypes = {
		user: PropTypes.object
	};

	render() {

		return (
			<main>
				<header className="page-header">
					<h1>Dashboard</h1>
				</header>
			</main>
		);
	}
}
