import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import { Card, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import { Button }             from 'react-toolbox/lib/button';
import * as actions           from '~/actions';
import { PACK_PRICES }        from '~/const';

class PackPicker extends PureComponent {
  @autobind
  handlePackChange(event) {
    this.props.actions.updateBooking({ [event.target.name]: event.target.value });
  }

  renderCardActions(packName, lang) {
    return (
      <CardActions>
        <Button raised
          label={
            <div>
              <Text id="select">Choose</Text>
              <Text id={`${name}.lowercase`}>{name}</Text>
            </div>
          }
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
                subtitle={<div><Text id="basic.subtitle" >
                  All essential services for a stress-free stay in your apartment - </Text>{packPrices.basic /100}€ </div>}
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
              {this.renderCardActions('basic', lang)}
            </Card> :
            ''
          }
          { minPack !== 'privilege' ?
            <Card raised={pack === 'comfort'}>
              <CardTitle
                title={<Text id="comfort.title">★★ Comfort</Text>}
                subtitle={<div><Text id="comfort.subtitle">
                  An easier move in for more comfort and serenity
                  - </Text>{packPrices.comfort / 100}€ </div>
                }
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
              {this.renderCardActions('comfort', lang)}
            </Card> :
            ''
          }
          <Card raised={pack === 'privilege'}>
            <CardTitle
              title={<Text id="privilege.title">★★★ Privilege</Text>}
              subtitle={<div><Text id="privilege.subtitle">
                Personalized services for a complete and careful support
                - </Text> {packPrices.privilege / 100}€</div>
              }
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
            {this.renderCardActions('privilege', lang)}
          </Card>
        </p>
      </IntlProvider>
    );
  }
}

const definition = { 'fr-FR': {
  basic: {
    lowercase: 'basique',
    title: '★ Basique',
    subtitle: 'Les principaux services pour un séjour sans stress dans votre appartement - ',
    first: 'Principaux services',
    second: 'Checkin rapide',
    third: 'Contrat individuel personnalisé',
    fourth: 'Oreiller et couette',
    fifth: 'Activation des services',
    sixth: 'Maintenance et assistance illimitées',
  },
  comfort: {
    lowercase: 'confort',
    title: '★★ Confort',
    subtitle: 'Plus de facilité pour plus de confort et de sérénité - ',
    first: 'Tous les services du pack Basique plus:',
    second: 'Checkin 24/7 au domicile',
    third: 'Draps, oreiller et housses de couette',
    fourth: 'Pack de nourriture',
    fifth: 'Priorité de réservation',
    sixth: 'Assurance annulation - 1 mois',
  },
  privilege: {
    lowercase: 'privilège',
    title: '★★★ Privilège',
    subtitle: 'Services personnalisés pour un support client complet et attentif - ',
    first: 'Tous les services du pack Confort plus:',
    second: 'Chauffeur privé de l\'aéroport/gare',
    third: 'Service de bagage illimité',
    fourth: 'Assistance clefs 24/7',
    fifth: 'Checkout 24/7',
    sixth: 'Assurance annulation - 7 jours',
  },
  select: 'Choisir',
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
