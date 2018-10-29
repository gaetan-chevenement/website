import { PureComponent }      from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import { IntlProvider, Text } from 'preact-i18n';
import { Button }             from 'react-toolbox/lib/button';
import { Input }              from 'react-toolbox/lib/input';
import { ProgressBar }        from 'react-toolbox/lib/progress_bar';
import autobind               from 'autobind-decorator';
import * as actions           from '~/actions';

class CouponField extends PureComponent {
  @autobind
  handleShowInput(event) {
    event.preventDefault();

    this.setState({ showInput: true });
  }

  @autobind
  handleChange(value, event) {
    this.setState({
      couponError: false,
      couponName: value,
    });
  }

  @autobind
  async handleSubmitCoupon() {
    const { orderId, actions } = this.props;

    this.setState({ isCouponValidating: true });

    try {
      await actions.addCoupon({
        orderId,
        couponName: this.state.couponName,
      });

      this.setState({
        isCouponValidating: false,
        isCouponValidated: true,
      });

      setTimeout(() => {
        this.setState({
          couponName: '',
          showInput: false,
          isCouponValidated: false,
        });
        actions.getOrder( orderId );
      }, 1500);
    }
    catch (error) {
      this.setState({
        couponError: 'Invalid coupon',
        isCouponValidating: false,
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      couponError: false,
      showInput: false,
      isCouponValidating: false,
      isCouponValidated: false,
      couponName: '',
    };
  }

  render({ lang }) {
    const {
      isCouponValidating,
      isCouponValidated,
      couponError,
      couponName,
      showInput,
    } = this.state;
    const isInputDisabled = isCouponValidating || isCouponValidated;

    return (
      <IntlProvider definition={definition[lang]}>
        {showInput ? (
          <div class="grid-6 has-gutter">
            <Input type="text" class="one-third"
              label={<Text id="holder">Coupon code</Text>}
              name="couponName"
              value={couponName}
              onChange={this.handleChange}
              disabled={isInputDisabled}
              error={couponError}
            />
            <Button raised primary class="one-sixth" style={{ marginTop: '20px' }}
              icon={isCouponValidated ? 'done' : 'send'}
              label={isCouponValidated ? '' : <Text id="apply">Apply</Text>}
              onClick={this.handleSubmitCoupon}
              disabled={isInputDisabled}
            />
            {isCouponValidating ? (
              <span class="one-sixth">
                <ProgressBar type="circular" mode="indeterminate" />
              </span>
            ) : ''}
          </div>
        ): (
          <a href="#nogo" onClick={this.handleShowInput}>
            <Text id="showInput">Use a coupon</Text>
          </a>
        )}
      </IntlProvider>
    );
  }
}

const definition = {
  'fr-FR': {
    holder: 'Code promo',
    apply: 'Valider',
    showInput: 'Utiliser un code promo',
  },
  'es-ES': {
    holder: 'Código promocional',
    apply: 'Validar',
    showInput: 'Utilizar un código promocional',
  },
};

function mapStateToProps({ route: { lang } }, { orderId }) {
  return {
    lang,
    orderId,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(CouponField);
