/**
 * Created by Ash on 2016-06-06.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { ITERATION_STATUS } from '../constants';


@connect(state => ({
	iteration: state.iteration,
	user: state.user
}))
export default class IterationContainer extends Component {

	static propTypes = {
		iteration: PropTypes.object,
		user: PropTypes.object
	};


	viewIteration(id) {
		location.hash = `/iteration/${id}`;
	}


	render() {
		const {
			iteration,
			user
		} = this.props,

			iterationList = iteration.iterationList;

		return (
			<main>
				<header className="page-header">
					<h1>Iteration</h1>
					<button type="button">Add Iteration</button>
				</header>

				<div className="card">
					<h2>Iteration List</h2>

					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Start Date</th>
								<th>Deadline</th>
								<th>End Date</th>
								<th>Task Count</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{
								iterationList.map(iteration => {
									return (
										<tr key={iteration._id} onClick={this.viewIteration.bind(this, iteration._id)}>
											<td>{iteration.year} 年第 {iteration.number} 次迭代</td>
											<td>{iteration.startDate}</td>
											<td>{iteration.deadline}</td>
											<td>{iteration.endDate}</td>
											<td>{iteration.tasks ? iteration.tasks.length : 0}</td>
											<td>
												<span className={ITERATION_STATUS[iteration.status].className}>
													{ITERATION_STATUS[iteration.status].text}
												</span>
											</td>
										</tr>
									);
								})
							}
						</tbody>
					</table>
				</div>
			</main>
		);
	}
}
