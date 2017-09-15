import { IntlProvider } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import capitalize             from 'lodash/capitalize';
import { Card, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import { Button }             from 'react-toolbox/lib/button';
import * as actions           from '~/actions';
import { PACK_PRICES }        from '~/const';

const _ = { capitalize };

class PackPicker extends PureComponent {
  @autobind
  handlePackChange(event) {
    this.props.actions.updateBooking({ [event.target.name]: event.target.value });
  }

  renderCardActions(packName) {
    return (
      <CardActions>
        <Button raised
          label={`Pick ${_.capitalize(packName)}`}
          name="pack"
          value={packName}
          onClick={this.handlePackChange}
        />
      </CardActions>
    );
  }

  render() {
    const {
      lang,
      pack,
      minPack,
      packPrices,
    } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <p class="grid-3-large-1 has-gutter">
          { minPack !== 'comfort' && minPack !== 'privilege' ?
            <Card raised={pack === 'basic'}>
              <CardTitle
                title="★ Basic"
                subtitle={`
                  All essential services for a stress-free stay in your apartment
                  - ${packPrices.basic / 100}€
                `}
              />
              <CardText>
                <List>
                  <ListSubHeader caption="Main services including" />
                  <ListItem caption="Fast check-in" />
                  <ListItem caption="Customized individual contract" />
                  <ListItem caption="Pillow and duvet" />
                  <ListItem caption="Services activation" />
                  <ListItem caption="Unlimited maintenance &amp; assistance" />
                </List>
              </CardText>
              {this.renderCardActions('basic')}
            </Card> :
            ''
          }
          { minPack !== 'privilege' ?
            <Card raised={pack === 'comfort'}>
              <CardTitle
                title="★★ Comfort"
                subtitle={`
                  An easier move in for more comfort and serenity
                  - ${packPrices.comfort / 100}€
                `}
              />
              <CardText>
                <List>
                  <ListSubHeader caption="All Basic services plus:" />
                  <ListItem caption="Check-in 24/7 at home" />
                  <ListItem caption="Sheets, pillow & duvet cases" />
                  <ListItem caption="Food pack" />
                  <ListItem caption="Booking priority" />
                  <ListItem caption="Cancellation insurance - 1 month" />
                </List>
              </CardText>
              {this.renderCardActions('comfort')}
            </Card> :
            ''
          }
          <Card raised={pack === 'privilege'}>
            <CardTitle
              title="★★★ Privilege"
              subtitle={`
                Personalized services for a complete and careful support
                - ${packPrices.privilege / 100}€
              `}
            />
            <CardText>
              <List>
                <ListSubHeader caption="All Comfort services plus:" />
                <ListItem caption="Private driver from airport/train station" />
                <ListItem caption="Unlimited luggage service" />
                <ListItem caption="Keys assistance 24/7" />
                <ListItem caption="Checkout 24/7" />
                <ListItem caption="Cancellation insurance - 7 days" />
              </List>
            </CardText>
            {this.renderCardActions('privilege')}
          </Card>
        </p>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
} };

function mapStateToProps({ route, booking, rooms, apartments }) {
  const { lang, minPack } = route;
  const { roomId, pack } = booking;
  const room = rooms[roomId];

  return {
    lang,
    pack,
    minPack,
    packPrices: PACK_PRICES[room && apartments[room.ApartmentId].addressCity],
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PackPicker);
