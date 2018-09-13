import random                 from 'lodash/random';
import { PureComponent }      from 'react';
import autobind               from 'autobind-decorator';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import SameSearchCount        from '~/components/search/SameSearchCount';
import SearchForm             from '~/components/SearchForm';
import CreateAlertButton      from '~/components/CreateAlertButton';
import ResultsList            from '~/containers/search/ResultsList';
import ResultsMap             from '~/containers/search/ResultsMap';
import Paging                 from '~/containers/search/Paging';
import * as actions           from '~/actions';
import Helmet from 'preact-helmet';
import _const                   from '~/const';
const { SEARCH_PAGE_TITLE_TEMPLATE } = _const;

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

const _ = { random };

export class Search extends PureComponent {
  static async prefetch(city, dispatch) {
    return Search.loadData(city, Date.now(), 1, {
      listRooms: params => dispatch(actions.listRooms(params)),
    });
  }

  static async loadData(city, date, page, actions) {
    return actions.listRooms({ city, date, page });
  }

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
    return _.random(750, 950);
  }

  constructor(props) {
    super(props);

    this.state = {
      overRoom: null,
      sameSearchCounter: this.getUsersCount(),
      mobilePane: 'list',
    };
  }

  componentDidMount() {
    if (!this.props.rooms) {
      const { city, date, page } = this.props;
      return Search.loadData(city, date, page, this.props.actions);
    }
  }

  componentWillReceiveProps({ city, date, page }) {
    if (
      city !== this.props.city ||
      date !== this.props.date ||
      page !== this.props.page
    ) {
      this.props.actions.listRooms({ city, date, page });
      this.setState({
        sameSearchCounter: this.getUsersCount(),
      });
    }
  }

  render() {
    const {
      isLoading,
      lang,
    } = this.props;

    return (
      <div className={viewport}>
        <Helmet
          title={SEARCH_PAGE_TITLE_TEMPLATE[lang]}
        />
        <div
          className={this.state.mobilePane !== 'map' ? mobileHide : mobileShow}
        >
          <div className={mapPane}>
            {typeof window !== 'object' ? null :
              (<ResultsMap highlightedRoomId={this.state.overRoom} currentlyShowing={this.state.mobilePane} />)}

          </div>
        </div>
        <div
          className={this.state.mobilePane !== 'list' ? mobileHide : mobileShow}
        >
          <div className={leftPane}>
            <div className={searchEngineAndAlerts}>
              <SearchForm mode="noSubmit" />
              <CreateAlertButton />
            </div>
            { isLoading ? (
              <div class="text-center">
                <ProgressBar type="circular" mode="indeterminate" />
              </div> ) : (
              <div>
                <SameSearchCount count={this.state.sameSearchCounter} />
                <ResultsList onRoomOver={this.onRoomOver} />
                <Paging />
              </div>
            ) }
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

function mapStateToProps({ route: { lang, date }, rooms }, { city }) {
  return {
    city,
    date: date && Number(date),
    isLoading: rooms.isLoading,
    lang,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
