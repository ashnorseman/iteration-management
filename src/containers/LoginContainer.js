/**
 * Created by Ash on 2016-06-13.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import UserActions from '../actions/UserActions';


@connect(state => ({
  user: state.user
}))
export default class LoginContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    user: PropTypes.object
  };

  login(e) {
    e.preventDefault();

    this.props.dispatch(UserActions.login({
      userName: document.getElementsByName('userName')[0].value,
      password: document.getElementsByName('password')[0].value
    }));
  }

  render() {
    return (
      <form className="login-form" method="post" onSubmit={::this.login}>
        <h1 className="login-form-title">Login</h1>
        <input type="text" name="userName" placeholder="Username" defaultValue="shaohui.li" />
        <input type="password" name="password" placeholder="Password" defaultValue="shaohui.li" />
        <button>Login</button>
      </form>
    );
  }
}
