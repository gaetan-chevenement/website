import { IntlProvider, Text } from 'preact-i18n';
import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import autobind               from 'autobind-decorator';
import { Card, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import { Button }             from 'react-toolbox/lib/button';
import { Dialog }             from 'react-toolbox/lib/dialog';
import * as actions           from '../../../actions';
import { PACK_PRICES }        from '../../../const';
import theme                  from './theme';

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

  render() {
    const { city, pack } = this.props;

    return (
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
              <ListSubHeader caption="Main services including:" />
              <ListItem caption="Fast check-in" />
              <ListItem caption="Customized individual contract" />
              <ListItem caption="Pillow and duvet" />
              <ListItem caption="Services activation" />
              <ListItem caption="Unlimited maintenance &amp; assistance" />
            </List>
          </CardText>
          <CardActions>
            <Button raised
              label="Pick Basic"
              name="pack"
              value="basic"
              onClick={this.handlePackChange}
            />
            <Button raised label="More details" onClick={this.handleDialogToggle} />
          </CardActions>
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
          <CardActions>
            <Button raised
              label="Pick Comfort"
              name="pack"
              value="comfort"
              onClick={this.handlePackChange}
            />
            <Button raised label="More details" onClick={this.handleDialogToggle} />
          </CardActions>
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
          <CardActions>
            <Button raised
              label="Pick Privilege"
              name="pack"
              value="privilege"
              onClick={this.handlePackChange}
            />
            <Button raised label="More details" onClick={this.handleDialogToggle} />
          </CardActions>
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
