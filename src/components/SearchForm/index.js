import { PureComponent }      from 'react';
import { route }              from 'preact-router';
import autobind               from 'autobind-decorator';
import { IntlProvider, Text } from 'preact-i18n';
import { Dropdown }           from 'react-toolbox/lib/dropdown';
import { DatePicker }         from 'react-toolbox/lib/date_picker';
// import { Input }              from 'react-toolbox/lib/input';
import { Button }             from 'react-toolbox/lib/button';
import _const                 from '~/const';
import {
  form,
  noSubmit,
  buttonContainer,
}                             from './style.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '~/actions';

const { SEARCHABLE_CITIES } = _const;

class SearchForm extends PureComponent {
  @autobind
  updateRoute() {
    const { city, date } = this.state;
    const dateParam = date != null ? `?date=${date.getTime()}` : '';

    return route(`/${this.props.lang}/search/${city}${dateParam}`);
  }

  @autobind
  handleSubmit(e) {
    e.preventDefault();

    if (this.state.city != null) {
      this.updateRoute();
    }
    else {
      this.setState({ error: true });
    }
  }

  @autobind
  handleCityChange(value, e) {
    // For some reason, two clicks are required without the following workaround
    // See https://github.com/react-toolbox/react-toolbox/pull/1725
    e.preventDefault();

    this.setState(
      { city: value, error: false },
      (this.props.mode !== 'home')  && this.updateRoute
    );
  }

  @autobind
  handleDateChange(value) {
    this.setState(
      { date: value },
      (this.props.mode !== 'home' ) && this.updateRoute
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      city: props.city,
      date: props.date && new Date(Number(props.date)),
      error: false,
    };
  }

  componentWillReceiveProps({ city, date }) {
    const newDate = date && new Date(Number(date));
    if (city !== this.props.city || newDate !== this.props.date) {
      this.setState({
        city,
        date: newDate,
      });
    }
  }

  render({ lang, mode }) {
    return (
      <IntlProvider definition={definition[lang]}>
        <form class={`${form} ${this.props.mode === 'noSubmit' ? noSubmit : ''}`} 
          style={this.props.mode === 'home' ? {flexWrap: 'wrap'} : null}> 
          { this.props.mode !== 'secondline' ? (
            <div>
              <i class="material-icons">location_city</i>
              <Dropdown
                id={this.props.mode === 'header' ? null : 'city-select'}
                onChange={this.handleCityChange}
                label={<Text id="city">City *</Text>}
                value={this.state.city}
                source={
                  SEARCHABLE_CITIES.map(({ name }) => ({ value: name, label: name }))
                }
                floating={false}
                error={this.state.error}
              />
            </div> ) : null }
          { this.props.mode !== 'firstline' ? (
            <div>
              <i className="material-icons">date_range</i>
              <DatePicker
                locale={lang.substring(0, 2)}
                label={<Text id="arrival">Arrival date</Text>}
                floating={false}
                value={this.state.date}
                onChange={this.handleDateChange}
                autoOk
              />
            </div>
          ) : null }
          {this.props.mode === 'home' ? (
            <div class={buttonContainer}>
              <Button
                label={<Text id="submit">Search</Text>}
                onClick={this.handleSubmit}
              />
            </div> ) : null
          }
        </form>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  arrival: 'Date d\'arrivée',
  city: 'Ville *',
  submit: 'Rechercher',
} };


function mapStateToProps({ route: { date, lang, city } }) {
  return {
    lang,
    city,
    date: date && Number(date),
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
