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
  'fr-FR': {
    specialOffer: [
      'Offre spéciale sur les chambres disponibles avant le 31/07',
      '→ Contactez nous avec le code SUMMER :)',
    ].join(' '),
  },
  'en-US': {
    specialOffer: [
      'Special discount on rooms available before 07/31',
      '→ Contact us with the code SUMMER :)',
    ].join(' '),
  },
};

function mapStateToProps({ route: { lang }, session }) {
  return {
    lang,
    isActive: session.isSpecialOfferBannerActive,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Banner);
