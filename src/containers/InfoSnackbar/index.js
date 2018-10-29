import { Component }          from 'preact';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import mapDispatchToProps     from '~/actions/mapDispatchToProps';
import { Snackbar }           from 'react-toolbox/lib/snackbar';
import style                  from './style.css';

class Banner extends Component {
  @autobind
  handleClick() {
    this.props.actions.hideInfoSnackbar();
  }

  constructor(props) {
    super(props);
    this.state = {
      isActive: null,
    };
  }

  componentWillMount() {
    const { actions, lang, roomId, cityId, cityInfo, roomInfo } = this.props;
    const name = 'banner';

    if ( roomId && roomInfo == null ) {
      actions.getI18n({ id: roomId, lang, name });
    }

    if ( cityId && cityInfo == null ) {
      actions.getI18n({ id: cityId, lang, name });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      if ( this.state.isActive !== false ) {
        this.props.actions.showInfoSnackbar();
      }
    }, 2000);
  }

  componentWillReceiveProps({ lang, roomId, cityId }) {
    const { actions } = this.props;
    const name = 'banner';

    if ( roomId && roomId !== this.props.roomId || lang !== this.props.lang ) {
      actions.getI18n({ id: roomId, lang, name });
    }

    if ( cityId && cityId !== this.props.cityId || lang !== this.props.lang ) {
      actions.getI18n({ id: cityId, lang, name });
    }
  }

  render({ lang, isActive, info }) {
    return (
      <Snackbar
        action="❌"
        active={isActive}
        label={info}
        timeout={999999}
        onClick={this.handleClick}
        type="cancel"
        theme={style}
      />
    );
  }
}

function mapStateToProps({ route: { lang, roomId, city }, session, i18ns }) {
  const cityId = city && city.toLowerCase();
  const roomInfo = roomId && i18ns[`${roomId}-${lang}-banner`];
  const cityInfo = cityId && i18ns[`${cityId}-${lang}-banner`];
  const isActive = (cityInfo || roomInfo) && session.isInfoSnackbarActive;
  const info = cityInfo || roomInfo;

  return {
    lang,
    isActive,
    roomInfo,
    cityInfo,
    info,
    roomId,
    cityId,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
