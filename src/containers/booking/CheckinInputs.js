import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { batch }              from 'redux-act';
import { IntlProvider, Text }       from 'preact-i18n';
import autobind               from 'autobind-decorator';
import D                      from 'date-fns';
import { DatePicker }         from 'react-toolbox/lib/date_picker';
import { TimePicker }         from 'react-toolbox/lib/time_picker';
import * as actions           from '~/actions';
import Utils                  from '~/utils';

class CheckinInputs extends PureComponent {
  @autobind
  handleChange(value, event) {
    const { actions } = this.props;

    batch(
      actions.updateBooking({ [event.target.name]: value }),
      actions.deleteBookingError(event.target.name)
    );
  }

  // for some reason, event is sometimes undefined with DatePicker
  @autobind
  handleDateChange(value, event) {
    this.handleChange(value, { target: { name: 'checkinDate' } });
  }

  render() {
    const {
      lang,
      bookingDate,
      checkinDate,
      checkinDateError,
    } = this.props;
    return (
      <IntlProvider definition={definition[lang]}>
        <div>
          <DatePicker
            label={<Text id="checkinDate">Check-in Date</Text>}
            name="checkinDate"
            locale={lang.split('-')[0]}
            value={checkinDate}
            onChange={this.handleDateChange}
            error={checkinDateError}
            minDate={D.startOfDay(bookingDate)}
          />
          <TimePicker
            label={<Text id="checkinTime">Check-in Time</Text>}
            name="checkinDate"
            value={checkinDate}
            onChange={this.handleDateChange}
            error={checkinDateError}
          />
        </div>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  checkinDate: 'Jour Du Checkin',
  checkinTime: 'Heure Du Checkin',
} };

function mapStateToProps({ route: { lang, roomId }, booking, rooms }) {
  const { checkinDate, errors } = booking;

  return {
    lang,
    checkinDate,
    bookingDate: Utils.getBookingDate(rooms[roomId]),
    checkinDateError: errors.checkinDate,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckinInputs);
