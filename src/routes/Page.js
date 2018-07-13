import { Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '~/actions';
import { route }   from 'preact-router';


class Page extends Component {

  createMarkup() {
    return {
      __html: this.props.pages[this.getFullSlug()].content,
    };
  }

  getFullSlug() {
    const { lang, slug } = this.props;
    return `${lang.toLowerCase()}-${slug.toLowerCase()}`;
  }

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
    this.loadData(this.getFullSlug());
  }

  render () {
    const fullSlug = this.getFullSlug();
    if (this.props.pages[fullSlug] === undefined || this.props.pages[fullSlug].isLoading) {
      return <div>...</div>;
    }
    return (
      <div className={"wp-content"} dangerouslySetInnerHTML={this.createMarkup()} />
    );

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
