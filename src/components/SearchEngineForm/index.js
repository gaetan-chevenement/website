/**
 * Created by flb on 17/08/2017.
 */
import { ContentSearchEngine, ContentTowns } from '~/content';
import { Component } from 'preact';
import { route } from 'preact-router';
import theme from './style.css';
import { Dropdown } from 'react-toolbox/lib/dropdown';
import { DatePicker } from 'react-toolbox/lib/date_picker';
import { Input } from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';

export default class SearchEngineForm extends Component {
  onSubmit(e) {
    e.preventDefault();

    if (this.state.city !== null) {
      route(`/fr/search/${this.state.city}`);
    }
  }

  handleCityChange(value) {
    this.setState({
      city: value,
    });
    if (this.props.mode === 'small') {
      route(`/fr/search/${value}`);
    }
  }

  handleDateChange(value) {
    this.setState({
      date: value,
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      city: props.defaultCity,
      date: null,
    };

    this._onSubmit = this.onSubmit.bind(this);
    this._handleCityChange = this.handleCityChange.bind(this);
    this._handleDateChange = this.handleDateChange.bind(this);
  }

  render() {
    let button = null,
      buttonContainer = null;

    if (this.props.mode !== 'small') {
      button = <Button label="Rechercher" onClick={this._onSubmit} />;
      buttonContainer = (
        <div className={theme.buttonContainer}>
          {button}
        </div>
      );
    }

    return (
      <form
        className={[
          theme.form,
          this.props.mode === 'small' ? theme.small : '',
        ].join(' ')}
      >
        <div>
          <i class="material-icons">location_city</i>
          <Dropdown
            onChange={this._handleCityChange}
            label="Ville"
            value={this.state.city}
            source={ContentTowns.list
              .filter(ct => ct.searchable)
              .map(ct => ({ value: ct.name, label: ct.name }))}
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
            onChange={this._handleDateChange}
          />
        </div>
        <div>
          <i class="material-icons">attach_money</i>
          <Input
            type="text"
            label="Tous les loyers"
            disabled
            floating={false}
          />
        </div>
        {buttonContainer}
      </form>
    );
  }
}
