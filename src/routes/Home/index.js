import { h, Component } from 'preact';

export default class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <iframe
          src="https://trello.com/c/MDblyTNf/1-first-test-card.html"
          width="600"
          height="600"
        />
      </div>
    );
  }
}
