import { bindActionCreators } from 'redux';
import * as actions           from './index';

export default function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}
