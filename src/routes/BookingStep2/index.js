import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }   from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import { Button }             from 'react-toolbox/lib/button';
import { Checkbox }           from 'react-toolbox/lib/checkbox';
import * as actions           from '../../actions';
import style                  from './style';

const definition = { 'fr-FR': {
} };

class BookingStep2 extends PureComponent {
  @autobind
  handleChange(value, event) {
    this.props.actions.updateBooking({ [event.target.name]: value });
  }

  // Note: `user` comes from the URL, courtesy of our router
  render({ lang, room }) {
    const { isEligible } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div class={style.profile}>
          <h1><Text id="title">Booking eligibility</Text></h1>

          <p>
            Before booking, you must test your eligibility for an accommodation
            by following the instructions of our simulator:
          </p>
          <p>
            <Button raised
              icon="launch"
              href="https://form.jotform.com/71984670904971"
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
            >
              &nbsp;I confirm that I am eligible for an accomodation with Chez Nestor
              and that I am able to provide all the required documents.
            </Checkbox>
          </p>

          <section style="margin-top: 2rem; text-align: center;">
            <Button raised
              icon="arrow_backward"
              href={`/${lang}/booking/${room}/`}
            >
              Back
            </Button>
            {' '}
            <Button raised primary
              icon="forward"
              href={`/${lang}/booking/${room}/3`}
            >
              Next
            </Button>
          </section>

        </div>
      </IntlProvider>
    );
  }
}

function mapStateToProps(state) {
  return { ...state.booking };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingStep2);
