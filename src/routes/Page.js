import { Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '~/actions';
import { route }   from 'preact-router';


class Page extends Component {
  async loadData(fullSlug) {
    const { actions } = this.props;

    try {
      await actions.getPage(fullSlug);
    }
    catch (e) {
      console.error(e);
      route(`/${this.props.lang}/404`);
    }

  }

  componentDidMount () {
    const { lang, slug } = this.props;
    // FIXME A mettre en place plus tard
    // this.loadData(`${lang}-${slug}`);
    this.loadData(`${slug}`);
  }

  render () {
    console.log(this.props);
    return <div>test</div>;
  }
}

function mapStateToProps(args) {
  const { pages } = args;

  return {
    pages,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
