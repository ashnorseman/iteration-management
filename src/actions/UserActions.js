/**
 * Created by Ash on 2016-06-06.
 */


import fetchie from 'fetchie';


export default {

	fetchUserList() {

		return dispatch => {

			dispatch({
				type: 'fetch-user-list'
			});

			return fetchie
				.get('/users')
				.then(res => {
					dispatch({
						type: 'fetch-user-list-success',
						data: res
					});
				});
		};
	}
};
