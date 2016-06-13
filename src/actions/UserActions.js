/**
 * Created by Ash on 2016-06-06.
 */


import fetchie from 'fetchie';


export default {

  login(data) {

    return dispatch => {
      return fetchie
        .post('/login')
        .send(data)
        .handleError(() => {
          alert('Login failed');
        })
        .then(res => {
          dispatch({
            type: 'login-success',
            data: res
          });
          location.hash = '#/iteration';
        });
    };
  },

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
