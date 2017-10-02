import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { IntlProvider, Text }       from 'preact-i18n';
import autobind               from 'autobind-decorator';
import { Button }             from 'react-toolbox/lib/button';
import { Checkbox }           from 'react-toolbox/lib/checkbox';
import * as actions           from '~/actions';
import theme                  from './theme';

class EligibilityInputs extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { actions } = this.props;

    batch(
      actions.updateBooking({ [event.target.name]: value }),
      actions.deleteBookingError(event.target.name)
    );
  }

  render() {
    const {
      lang,
      isEligible,
    } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <p>
            <Text id="ensure">Before booking, you need to ensure you are eligibile for an
            accommodation with Chez Nestor:</Text>
            <Button
              icon="launch"
              href="https://forms.chez-nestor.com/72003771604953"
              target="_blank"
            >
              <Text id="eligibility">Test your eligibility</Text>
            </Button>
          </p>
          <p>
            <Checkbox
              name="isEligible"
              checked={isEligible}
              onChange={this.handleChange}
              field={theme.eligible}
            >
              &nbsp;<Text id="confirm">I confirm that I am eligible,
              that I am able to provide all the required documents,
              and that I have read and accepted the</Text>{' '}
              <a
                href="https://drive.google.com/file/d/0B8dLiyBmm3wJa1IwbWsxbk85LWs/view"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text id="terms">terms and conditions.</Text>
              </a>
            </Checkbox>
          </p>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  ensure: 'Avant de réserver, vous devez vous assurer que vous êtes admissible à un logement Chez Nestor:',
  eligibility: 'Testez votre éligibilité',
  confirm: 'Je confirme que je suis admissible, que je peux fournir tous les documents requis, et que j\'ai lu et accepté les',
  terms: 'termes et conditions.',
} };

function mapStateToProps({ route: { lang }, booking: { isEligible } }) {
  return {
    lang,
    isEligible,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EligibilityInputs);
