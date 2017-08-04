import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import capitalize             from 'lodash/capitalize';
import { Card, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import { Button }             from 'react-toolbox/lib/button';
import { Dialog }             from 'react-toolbox/lib/dialog';
import * as actions           from '../../../actions';
import { PACK_PRICES }        from '../../../const';
import theme                  from './theme';

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

  @autobind
  handleDialogToggle() {
    this.setState({ isDialogActive: !this.state.isDialogActive });
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
        <Button raised
          icon="info"
          label="Details"
          onClick={this.handleDialogToggle}
        />
      </CardActions>
    );
  }

  render({ lang }) {
    const { city, pack } = this.props;

    return (
      <IntlProvider definition={definition[lang]}>
        <div class="grid has-gutter">
          <Card raised={pack === 'basic'}>
            <CardTitle
              title="★ Basic"
              subtitle={`
                All essential services for a stress-free stay in your apartment
                - ${PACK_PRICES[city].basic / 100}€
              `}
            />
            <CardText>
              <List>
                <ListSubHeader><Text>Main services including</Text>:</ListSubHeader>
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
                - ${PACK_PRICES[city].comfort / 100}€
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
                - ${PACK_PRICES[city].privilege / 100}€
              `}
            />
            <CardText>
              <List>
                <ListSubHeader caption="All Comfort services plus:" />
                <ListItem caption="Check-in 24/7 at home" />
                <ListItem caption="Sheets, pillow & duvet cases" />
                <ListItem caption="Food pack" />
                <ListItem caption="Booking priority" />
                <ListItem caption="Cancellation insurance - 1 month" />
              </List>
            </CardText>
            {this.renderCardActions('privilege')}
          </Card>
          <Dialog
            active={this.state.isDialogActive}
            onEscKeyDown={this.handleDialogToggle}
            onOverlayClick={this.handleDialogToggle}
            title="Housing Pack Comparison"
            actions={[
              { label: 'Got it!', onClick: this.handleDialogToggle, raised: true },
            ]}
            theme={theme}
          >
            <img style="width: 100%;" src="../../assets/Housing-Packs-FR-2017-3.png" />
          </Dialog>
        </div>
      </IntlProvider>
    );
  }
}

function mapStateToProps(state) {
  return { ...state.booking };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PackPicker);
