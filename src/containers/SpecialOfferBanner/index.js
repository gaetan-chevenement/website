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
    this.props.actions.hideSpecialOfferBanner();
  }

  constructor(props) {
    super(props);
    this.state = {
      isActive: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      if ( this.state.isActive !== false ) {
        this.props.actions.showSpecialOfferBanner();
      }
    }, 2000);
  }

  render({ lang, isActive, children }) {
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
      '72 Saxe apartment: No wifi until October 23rd',
    ].join(' '),
  },
  'fr-FR': {
    specialOffer: [
      'Appartement du 72 Saxe : Pas de wifi avant le 23/10',
    ].join(' '),
  },
  'es-ES': {
    specialOffer: [
      'Apartamento del 72 Saxe : No wifi antes del 23/10',
    ].join(' '),
  },
};

function mapStateToProps({ route: { lang, roomId }, rooms, session }) {
  const isActive =
    roomId && rooms[roomId] &&
    rooms[roomId].ApartmentId === '23b64fa6-79db-4e09-b880-6c7fe80c9c97' &&
    session.isSpecialOfferBannerActive;

  return {
    lang,
    isActive,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
