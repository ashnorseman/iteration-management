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
    return {
      ...state,
      login: true,
      userData: {
        ...data,
        isMaster: data.role === 'MASTER'
      }
    };
	case 'fetch-user-list-success':
		return {
			...state,
			userList: data || []
		};
	}

	return state;
}
