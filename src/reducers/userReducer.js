/**
 * Created by Ash on 2016-06-06.
 */


const initialState = {
  userData: {},
	userList: []
};


export default function (state = initialState, { type, data } = {}) {

	switch (type) {
  case 'login-success':
    data.isMaster = data.role === 'MASTER';
    localStorage.setItem('user', JSON.stringify(data));

    return {
      ...state,
      login: true,
      userData: data
    };
  case 'logout':
    localStorage.removeItem('user');

    return {
      ...state,
      login: false,
      userData: {}
    };
  case 'read-user-info':
    return {
      ...state,
      login: true,
      userData: data
    };
	case 'fetch-user-list-success':
		return {
			...state,
			userList: data || []
		};
	}

	return state;
}
