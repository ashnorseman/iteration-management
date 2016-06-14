/**
 * Created by Ash on 2016-06-06.
 */


import fetchie from 'fetchie';


export default {

  login(data) {

    return dispatch => fetchie
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
  },

  logout() {
    return {
      type: 'logout'
    };
  },

  readFromLocal(data) {
    return {
      type: 'read-user-info',
      data
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
