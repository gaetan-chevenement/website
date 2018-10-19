import { Component }          from 'preact';
import { connect }            from 'react-redux';
import { IntlProvider, Text } from 'preact-i18n';
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

    if ( roomId !== this.props.roomId || lang !== this.props.lang ) {
      actions.getI18n({ id: roomId, lang, name });
    }

    if ( cityId !== this.props.cityId || lang !== this.props.lang ) {
      actions.getI18n({ id: cityId, lang, name });
    }
  }

  render({ lang, isActive }) {
    return (
      <IntlProvider definition={definition[lang]}>
        <Snackbar
          action="❌"
          active={isActive}
          label={<Text id="specialOffer" />}
          timeout={999999}
          onClick={this.handleClick}
          type="cancel"
          theme={style}
        />
      </IntlProvider>
    );
  }
}

const definition = {
  'en-US': {
    specialOffer: [
      '75 Gambetta bedroom 3: AC below, background noise and vibrations',
    ].join(' '),
  },
  'fr-FR': {
    specialOffer: [
      '75 Gambetta chambre 3: clim à l\'étage inférieur, bruit de fond et vibrations',
    ].join(' '),
  },
  'es-ES': {
    specialOffer: [
      '75 Gambetta bedroom 3: AC below, background noise and vibrations',
    ].join(' '),
  },
};

function mapStateToProps({ route: { lang, roomId, city }, session, i18ns }) {
  const roomInfo = roomId && i18ns[`${roomId}-i18n-${lang}-banner`];
  const cityInfo = roomId && i18ns[`${roomId}-i18n-${lang}-banner`];
  const isActive = (cityInfo || roomInfo) && session.isInfoSnackbarActive;
  const info = cityInfo || roomInfo;

  return {
    lang,
    isActive,
    roomInfo,
    cityInfo,
    info,
    roomId,
    cityId: city && city.toLowerCase(),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
