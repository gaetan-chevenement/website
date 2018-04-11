import { PureComponent }      from 'react';
import { route }              from 'preact-router';
import autobind               from 'autobind-decorator';
import { IntlProvider, Text } from 'preact-i18n';
import { Dropdown }           from 'react-toolbox/lib/dropdown';
import { DatePicker }         from 'react-toolbox/lib/date_picker';
// import { Input }              from 'react-toolbox/lib/input';
import { Button }             from 'react-toolbox/lib/button';
import Utils                  from '~/utils';
import _const                 from '~/const';
import {
  form,
  noSubmit,
  buttonContainer,
}                             from './style.css';

const { SEARCHABLE_CITIES } = _const;

class SearchForm extends PureComponent {
  @autobind
  onSubmit(e) {
    e.preventDefault();

    if (this.props.city !== null) {
      route(`/${this.props.lang}/search/${this.state.city}`);
    }
  }

  @autobind
  handleCityChange(value, e) {
    // For some reason, two clicks are required without the following workaround
    // See https://github.com/react-toolbox/react-toolbox/pull/1725
    e.preventDefault();

    this.setState({ city: value });

    if (this.props.mode === 'noSubmit') {
      return route(`/${this.props.lang}/search/${value}`);
    }
  }

  @autobind
  handleDateChange(value) {
    this.setState({ date: value });
  }

  constructor(props) {
    super(props);

    this.state = {
      city: props.city,
      date: props.date,
    };
  }

  componentWillReceiveProps({ city }) {
    if ( city !== this.props.city ) {
      this.setState({ city });
    }
  }

  render({ lang, mode }) {
    return (
      <IntlProvider definition={definition[lang]}>
        <form class={`${form} ${this.props.mode === 'noSubmit' ? noSubmit : ''}`}>
          <div>
            <i class="material-icons">location_city</i>
            <Dropdown
              onChange={this.handleCityChange}
              label={<Text id="city">City</Text>}
              value={this.state.city}
              source={
                SEARCHABLE_CITIES.map(({ name }) => ({ value: name, label: name }))
              }
              floating={false}
            />
          </div>
          <div>
            <i class="material-icons">date_range</i>
            <DatePicker
              locale={lang.substring(0,2)}
              label={<Text id="arrival">Arrival date</Text>}
              floating={false}
              value={this.state.date}
              onChange={this.handleDateChange}
            />
          </div>
          {this.props.mode === 'noSubmit' ?
            { /*<div>
              <i class="material-icons">attach_money</i>
              <Input
                type="text"
                label="Tous les loyers"
                disabled
                floating={false}
              />
            </div> */} :
            <div class={buttonContainer}>
              <Button
                label={<Text id="submit">Search</Text>}
                onClick={this.onSubmit}
              />
            </div>
          }
        </form>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  arrival: 'Date d\'arrivée',
  city: 'Ville',
  submit: 'Rechercher',
} };

export default Utils.connectLang(SearchForm);
