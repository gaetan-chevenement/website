import { h }                  from 'preact';
import { PureComponent }      from 'react';
import { route }              from 'preact-router';
import autobind               from 'autobind-decorator';
import { Dropdown }           from 'react-toolbox/lib/dropdown';
import { DatePicker }         from 'react-toolbox/lib/date_picker';
import { Input }              from 'react-toolbox/lib/input';
import { Button }             from 'react-toolbox/lib/button';
import _const                 from '~/const';
import {
  form,
  noSubmit,
  buttonContainer,
}                             from './style.css';

const { SEARCHABLE_CITIES } = _const;

export default class SearchForm extends PureComponent {
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

  render() {
    return (
      <form class={`${form} ${this.props.mode === 'noSubmit' ? noSubmit : ''}`}>
        <div>
          <i class="material-icons">location_city</i>
          <Dropdown
            onChange={this.handleCityChange}
            label="Ville"
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
            locale="fr"
            label="Date d'arrivée"
            floating={false}
            value={this.state.date}
            onChange={this.handleDateChange}
          />
        </div>
        {this.props.mode === 'noSubmit' ?
          <div>
            <i class="material-icons">attach_money</i>
            <Input
              type="text"
              label="Tous les loyers"
              disabled
              floating={false}
            />
          </div> :
          <div class={buttonContainer}>
            <Button label="Rechercher" onClick={this.onSubmit} />
          </div>
        }
      </form>
    );
  }
}
