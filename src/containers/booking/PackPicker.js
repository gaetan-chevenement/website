import { IntlProvider, Text} from 'preact-i18n';
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
                title={<Text id="basic.title">★ Basic</Text>}
                subtitle={<Text id="basic.subtitle">
                  All essential services for a stress-free stay in your apartment</Text>}// - ${packPrices.basic /100}€
              />
              <CardText>
                <List>
                  <ListSubHeader caption={<Text id="basic.first">Main services including</Text>} />
                  <ListItem caption={<Text id="basic.second">Fast check-in</Text>} />
                  <ListItem caption={<Text id="basic.third">Customized individual contract</Text>} />
                  <ListItem caption={<Text id="basic.fourth">Pillow and duvet</Text>} />
                  <ListItem caption={<Text id="basic.fifth">Services activation</Text>} />
                  <ListItem caption={<Text id="basic.sixth">Unlimited maintenance &amp; assistance</Text>} />
                </List>
              </CardText>
              {this.renderCardActions(lang.split[0] === 'en' ? 'basic' : 'basique')}
            </Card> :
            ''
          }
          { minPack !== 'privilege' ?
            <Card raised={pack === 'comfort'}>
              <CardTitle
                title={<Text id="comfort.title">★★ Comfort</Text>}
                subtitle={`
                  An easier move in for more comfort and serenity
                  - ${packPrices.comfort / 100}€
                `}
              />
              <CardText>
                <List>
                  <ListSubHeader caption={<Text id="comfort.first">All Basic services plus:</Text>} />
                  <ListItem caption={<Text id="comfort.second">Check-in 24/7 at home</Text>} />
                  <ListItem caption={<Text id="comfort.third">Sheets, pillow & duvet cases</Text>} />
                  <ListItem caption={<Text id="comfort.fourth">Food pack</Text>} />
                  <ListItem caption={<Text id="comfort.fifth">Booking priority</Text>} />
                  <ListItem caption={<Text id="comfort.sixth">Cancellation insurance - 1 month</Text>} />
                </List>
              </CardText>
              {this.renderCardActions(lang.split[0] === 'en' ? 'comfort': 'confort')}
            </Card> :
            ''
          }
          <Card raised={pack === 'privilege'}>
            <CardTitle
              title={<Text id="privilege.title">★★★ Privilege</Text>}
              subtitle={`
                Personalized services for a complete and careful support
                - ${packPrices.privilege / 100}€
              `}
            />
            <CardText>
              <List>
                <ListSubHeader caption={<Text id="privilege.first">All Comfort services plus:</Text>} />
                <ListItem caption={<Text id="privilege.second">Private driver from airport/train station</Text>} />
                <ListItem caption={<Text id="privilege.third">Unlimited luggage service</Text>} />
                <ListItem caption={<Text id="privilege.fourth">Keys assistance 24/7</Text>} />
                <ListItem caption={<Text id="privilege.fifth">Checkout 24/7</Text>} />
                <ListItem caption={<Text id="privilege.sixth">Cancellation insurance - 7 days</Text>} />
              </List>
            </CardText>
            {this.renderCardActions(lang.split[0] === 'en' ? 'privilege' : 'privilège')}
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
