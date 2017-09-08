import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { IntlProvider }       from 'preact-i18n';
import autobind               from 'autobind-decorator';
import { Button }             from 'react-toolbox/lib/button';
import { Checkbox }           from 'react-toolbox/lib/checkbox';
import * as actions           from '~/actions';
import theme                  from './theme';

class EligibilityInputs extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { updateBooking, deleteBookingError } = this.props.actions;

    batch(
      updateBooking({ [event.target.name]: value }),
      deleteBookingError(event.target.name)
    );
  }

  render({ lang }) {
    const { isEligible } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <p>
            Before booking, you need to ensure you are eligibile for an
            accommodation with Chez Nestor:
            <Button
              icon="launch"
              href="https://forms.chez-nestor.com/72003771604953"
              target="_blank"
            >
              Test your eligibility
            </Button>
          </p>
          <p>
            <Checkbox
              name="isEligible"
              checked={isEligible}
              onChange={this.handleChange}
              field={theme.eligible}
            >
              &nbsp;I confirm that I am eligible,
              that I am able to provide all the required documents,
              and that I have read and accepted the{' '}
              <a
                href="https://drive.google.com/file/d/0B8dLiyBmm3wJa1IwbWsxbk85LWs/view"
                target="_blank"
                rel="noopener noreferrer"
              >
                terms and conditions.
              </a>
            </Checkbox>
          </p>
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
} };

function mapStateToProps({ booking: { isEligible } }) {
  return { isEligible };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EligibilityInputs);
