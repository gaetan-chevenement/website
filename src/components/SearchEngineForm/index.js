import { h }              from 'preact';
import { PureComponent }  from 'react';
import { route }          from 'preact-router';
import autobind           from 'autobind-decorator';
import { Dropdown }       from 'react-toolbox/lib/dropdown';
import { DatePicker }     from 'react-toolbox/lib/date_picker';
import { Input }          from 'react-toolbox/lib/input';
import { Button }         from 'react-toolbox/lib/button';
import { ContentTowns }   from '~/content';
import {
  form,
  noSubmit,
  buttonContainer,
}                         from './style.css';

export default class SearchEngineForm extends PureComponent {
  @autobind
  onSubmit(e) {
    e.preventDefault();

    if (this.state.city !== null) {
      route(`/fr/search/${this.state.city}`);
    }
  }

  @autobind
  handleCityChange(value) {
    if (this.props.mode === 'noSubmit') {
      return route(`/fr/search/${value}`);
    }

    this.setState({ city: value });
  }

  @autobind
  handleDateChange(value) {
    this.setState({ date: value });
  }

  constructor(props) {
    super(props);

    this.state = {
      city: props.city,
      date: null,
    };
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
            onChange={this.handleDateChange}
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
        {this.props.mode !== 'noSubmit' ?
          <div class={buttonContainer}>
            <Button label="Rechercher" onClick={this.onSubmit} />
          </div> : ''
        }
      </form>
    );
  }
}
