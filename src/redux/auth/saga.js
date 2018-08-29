import { all, takeEvery, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import actions from './actions';

import api from '../../services/api';

export function* signin({ email, password }) {

  try {
    const { user, token, success, msg } = yield api.signin(email, password);
    if (!success) {
      yield put({ type: actions.SIGNIN_ERROR, error: msg });
      return;
    }

    yield put({ type: actions.SIGNIN_SUCCESS, user, token });
    localStorage.setItem('token', token)

    amplitude.getInstance().setUserId(email);

    yield put(push('/'));
  } catch (e) {
    yield put({ type: actions.SIGNIN_ERROR, error: e });
  }
}

export function* signinByToken() {
  const token = localStorage.getItem('token')
  if (token) {
    const response = yield api.getUser(token);
    if (response && response.user) {
      yield put({ type: actions.SIGNIN_SUCCESS, user: response.user, token });
      return;
    }
    localStorage.removeItem('token')
  }
  yield put({ type: actions.SIGNIN_FAILED });
}

export function* logOut() {
  localStorage.removeItem('token')
  yield put(push('/'));
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.SIGNIN_REQUEST, signin),
    takeEvery(actions.LOGOUT, logOut),
    takeEvery(actions.SIGNIN_BY_TOKEN_REQUEST, signinByToken),
  ]);
}
