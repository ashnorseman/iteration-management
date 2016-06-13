/**
 * Created by Ash on 2016-06-06.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { ITERATION_STATUS } from '../constants';

import IterationActions from '../actions/IterationActions';


@connect(state => ({
	iteration: state.iteration,
	user: state.user
}))
export default class IterationContainer extends Component {

	static propTypes = {
		dispatch: PropTypes.func,
		iteration: PropTypes.object,
		user: PropTypes.object
	};


	viewIteration(id) {
		location.hash = `/iteration/${id}`;
	}


	toggleAddMode() {
		this.props.dispatch(IterationActions.toggleAddMode());
	}


	render() {
		const {
			iteration,
			user
		} = this.props,

			userData = user.userData || {},
			userList = user.userList || [],
			iterationList = iteration.iterationList || [],

			addForm = iteration.iterationAddMode && userData.isMaster
				? <form className="iteration-form" action="/iterations" method="POST">
						<dl>
							<dt>Year: </dt>
							<dd>
								<select name="year" defaultValue="2016">
									<option value="2016">2016</option>
								</select>
							</dd>
							<dt>Number: </dt>
							<dd><input type="number" name="number" /></dd>
							<dt>Status: </dt>
							<dd>
								<select name="status" defaultValue="NOT_STARTED">
									<option value="NOT_STARTED">未开始</option>
									<option value="IN_PROGRESS">进行中</option>
									<option value="SUCCESS">成功</option>
									<option value="FAILURE">失败</option>
								</select>
							</dd>
							<dt>Start Date: </dt>
							<dd><input type="date" name="startDate" /></dd>
							<dt>End Date: </dt>
							<dd><input type="date" name="endDate" /></dd>
							<dt>Deadline: </dt>
							<dd><input type="date" name="deadline" /></dd>
							<dt>Developers: </dt>
							<dd>
								{
									userList.map(user => {
										return (
											<label className="check-box" key={user._id}>
												<input type="checkbox" name="developers" value={user._id} defaultChecked />
												{user.name}
											</label>
										);
									})
								}
							</dd>
						</dl>

						<div className="form-submit"><button>Add</button></div>
					</form>
				: null;

		return (
			<main>
				<header className="page-header">
					<h1>Iteration</h1>

          {
            userData.isMaster
              ? <button type="button" onClick={::this.toggleAddMode}>Add Iteration</button>
              : null
          }
				</header>

				{addForm}

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
