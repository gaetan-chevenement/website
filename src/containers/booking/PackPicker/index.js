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

const definition = { 'fr-FR': {
} };

class PackPicker extends PureComponent {
  state = {
    isDialogActive: false,
  };

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
      apartment: { addressCity },
      booking: { pack },
    } = this.props;
    const packPrices = PACK_PRICES[addressCity];

    return (
      <IntlProvider definition={definition[lang]}>
        <p class="grid-3-large-1 has-gutter">
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
          </Card>
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
          </Card>
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

function mapStateToProps({ route: { lang, roomId }, booking, rooms, apartments }) {
  return {
    lang,
    booking,
    room: rooms[roomId],
    apartment: rooms[roomId] && apartments[rooms[roomId].ApartmentId],
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PackPicker);
