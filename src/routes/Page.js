import { Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '~/actions';
import { route }   from 'preact-router';
import { ProgressBar } from 'react-toolbox/lib/progress_bar';


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
      if (!this.props.noRedirect && e.error.isNotFound) {
        route(`/${this.props.lang}/404`);
      } else {
        throw e;
      }
    }
  }

  componentDidMount () {
    this.loadData(this.getFullSlug());
  }

  render () {
    const fullSlug = this.getFullSlug();
    if (this.props.pages[fullSlug] === undefined || this.props.pages[fullSlug].isLoading) {
      return (
        <div class="content text-center">
          <ProgressBar type="circular" mode="indeterminate" />
        </div>
      );
    }
    const page = this.props.pages[this.getFullSlug()];
    return (
      <div className={'wp-content'}>
        <h1>{page.title.rendered}</h1>
        <div dangerouslySetInnerHTML={this.createMarkup()} />
      </div>

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
