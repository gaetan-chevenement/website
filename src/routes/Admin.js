import { Component }          from 'react';
import { route }              from 'preact-router';
import autobind               from 'autobind-decorator';
import Utils                  from '~/utils';

class Admin extends Component {
  @autobind
  handleInputChange(event) {
    const value =  event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  }

  @autobind
  handleSubmit(event) {
    const { email, password } = this.state;
    event.preventDefault();

    Utils.fetchJson('/login', {
      method: 'POST',
      body: {
        email,
        password,
      },
    })
      // TODO: we should redirect to returnUrl
      .then(() => route('/fr-FR'))
      .catch((e) => {
        this.setState({
          error: e.message,
        });
      });
  }


  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
          Email
            <input
              name="email"
              type="text"
              value={this.state.email}
              onChange={this.handleInputChange}
            />
          </label>
          <br />
          <label>
          Password
            <input
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {this.state.error ?
          <h1>{this.state.error}</h1>:
          ''
        }
      </div>

    );
  }
}


export default Admin;
