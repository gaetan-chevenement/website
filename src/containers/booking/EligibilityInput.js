import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { IntlProvider, Text }       from 'preact-i18n';
import autobind               from 'autobind-decorator';
import { Button }             from 'react-toolbox/lib/button';
import { Checkbox }           from 'react-toolbox/lib/checkbox';
import _const                 from '~/const';
import * as actions           from '~/actions';
import theme                  from './theme';

const { ELIGIBILITY_FORM_URL } = _const;

class EligibilityInputs extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { actions } = this.props;

    batch(
      actions.updateBooking({ [event.target.name]: value }),
      actions.deleteBookingError(event.target.name)
    );
  }

  render({ lang, isEligible, hasAcceptedTerms }) {
    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <p>
            <Text id="eligible.test">
              Before booking, you need to ensure you are eligibile for
              accommodation with Chez Nestor:&nbsp;
            </Text>
            <Button raised
              icon="launch"
              href={ELIGIBILITY_FORM_URL}
              target="_blank"
            >
              <Text id="eligible.link">Test your eligibility</Text>
            </Button>
          </p>
          <p>
            <Checkbox
              name="isEligible"
              checked={isEligible}
              onChange={this.handleChange}
              field={theme.eligible}
            >
              {' '}
              <Text id="eligible.confirm">
                I confirm that I am eligible, and that I am able to provide
                all the required documents
              </Text>
            </Checkbox>
          </p>
          <p>
            <Checkbox
              name="hasAcceptedTerms"
              checked={hasAcceptedTerms}
              onChange={this.handleChange}
              field={theme.eligible}
            >
              {' '}
              <Text id="terms.confirm">
                I confirm that I have read and accepted the
              </Text>
              <a
                href="https://drive.google.com/file/d/0B8dLiyBmm3wJa1IwbWsxbk85LWs/view"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text id="terms.link">terms and conditions.</Text>
              </a>
            </Checkbox>
          </p>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  eligible: {
    test: [
      'Avant de réserver, vous devez vous assurer que vous êtes admissible à',
      'un logement Chez Nestor:',
    ].join(' '),
    link: '',
    confirm: [
      'Je confirme que je suis admissible, que je peux fournir tous les',
      'documents requis, et que j\'ai lu et accepté les',
    ].join(' '),
  },
  terms: {
    confirm: '',
    link: 'termes et conditions.',
  },
} };

function mapStateToProps({ route: { lang }, booking: { isEligible, hasAcceptedTerms } }) {
  return {
    lang,
    isEligible,
    hasAcceptedTerms,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EligibilityInputs);
