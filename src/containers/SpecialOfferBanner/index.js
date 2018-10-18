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

function mapStateToProps({ route: { lang, roomId }, rooms, session }) {
  const isActive =
    roomId &&
    roomId === '6ff5327f-27b8-461e-9b81-be6281f6a691' &&
    session.isSpecialOfferBannerActive;

  return {
    lang,
    isActive,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
