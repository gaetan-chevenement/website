import { h }                  from 'preact';
import { PureComponent }      from 'react';
import autobind               from 'autobind-decorator';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as actions           from '~/actions';
import SearchEngineForm       from '~/components/SearchEngineForm';
import SameSearchCount        from '~/components/SameSearchCount';
import ResultsList            from '~/containers/search/ResultsList';
import ResultsMap             from '~/containers/search/ResultsMap';
import {
  SameSearchCountOptions,
}                             from '~/content';
import {
  CreateAlertButton,
}                             from '~/components/CreateAlertButton';
import {
  mapPane,
  leftPane,
  searchEngineAndAlerts,
  switchMapList,
  mobileHide,
  selected,
  viewport,
  mobileShow,
}                             from './style.css';

export class SearchContainer extends PureComponent {
  @autobind
  onRoomOver(room) {
    this.setState({ overRoom: room });
  }

  @autobind
  switchToList() {
    this.setState({ mobilePane: 'list' });
  }

  @autobind
  switchToMap() {
    this.setState({ mobilePane: 'map' });
  }

  getUsersCount() {
    const { min, max } = SameSearchCountOptions;
    return min + Math.ceil((max - min) * Math.random());
  }

  constructor(props) {
    super(props);

    this.state = {
      overRoom: null,
      sameSearchCounter: this.getUsersCount(),
      mobilePane: 'list',
    };

    this.props.actions.updateSearch({ city: this.props.city });
  }

  componentDidMount() {
    this.props.actions.listRooms({ city: this.props.city });
  }

  // componentWillReceiveProps({ city }) {
  //   if (this.props.city !== city) {
  //     this.props.dispatch(listRooms({ city }));
  //     this.setState({
  //       sameSearchCounter: this.getUsersCount(),
  //     });
  //   }
  // }

  render() {
    return (
      <div className={viewport}>
        <div
          className={this.state.mobilePane !== 'map' ? mobileHide : mobileShow}
        >
          <div className={mapPane}>
            <ResultsMap
              highlightedRoomId={this.state.overRoom}
              currentlyShowing={this.state.mobilePane}
            />
          </div>
        </div>
        <div
          className={this.state.mobilePane !== 'list' ? mobileHide : mobileShow}
        >
          <div className={leftPane}>
            <div className={searchEngineAndAlerts}>
              <SearchEngineForm mode="noSubmit" city={this.state.city} />
              <CreateAlertButton />
            </div>
            <SameSearchCount count={this.state.sameSearchCounter} />
            <ResultsList onRoomOver={this.onRoomOver} />
          </div>
        </div>
        <div className={switchMapList}>
          <span
            onClick={this.switchToList}
            className={this.state.mobilePane === 'list' ? selected : null}
          >
            Liste
          </span>
          <span
            onClick={this.switchToMap}
            className={this.state.mobilePane === 'map' ? selected : null}
          >
            Plan
          </span>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ rooms, route: { lang } }, { city }) {
  return {
    lang,
    city,
    rooms,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
