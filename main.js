import React from 'react';
import ReactDOM from 'react-dom'
import graph from 'fb-react-sdk';


class LoginComponent extends React.Component {

  constructor(props) {
    super(props);
    this.checkLoginState = this.checkLoginState.bind(this);
    this.handleFBLogin = this.handleFBLogin.bind(this);
    this.testAPI = this.testAPI.bind(this);
    this.statusChangeCallback = this.statusChangeCallback.bind(this);
    this.state = {
    	data : [],
    	data1: []
    };
  }

  loadFbLoginApi() {

        window.fbAsyncInit = function() {
            FB.init({
                appId      : 1601761023221524,
                cookie     : true,  // enable cookies to allow the server to access
                // the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.10' // use version 2.1
            });
        };

        console.log("Loading fb api");
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
  }

  componentDidMount() {
        this.loadFbLoginApi();
    }

    testAPI(userId) {
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/'+userId+'/taggable_friends?limit=5000&fields=id,name,picture.type(normal)', function(response) {
      this.setState({
                data: response.data.slice(0,response.data.length/2),
                data1: response.data.slice(response.data.length/2 + 1, response.data.length)
            });
      
      document.getElementById('btn-social-login').textContent = "Logged In";
      document.getElementById('status').innerHTML =
        'Thanks for logging in! Below is your Friends List';
      }.bind(this));
    }


    statusChangeCallback(response) {
      if (response.status === 'connected') {
      	//var status = document.getElementById('btn-social-login').textContent;
      	//if(status === "Sign in with Facebook"){
       		this.testAPI(response.authResponse.userID);
    	/*}
    	else{
    		FB.logout(function(response) {
			});
			document.getElementById('btn-social-login').textContent = "Sign in with Facebook";
		}*/
      } else if (response.status === 'not_authorized') {
          console.log("Please log into this app.");
      } else {
          console.log("Please log into this facebook.");
      }
    }

    checkLoginState() {
      FB.getLoginStatus(function(response) {
        this.statusChangeCallback(response);
      }.bind(this),true);
    }

    handleFBLogin() {
        FB.login(this.checkLoginState(),
		        	{
		    scope: 'user_friends',
		    auth_type: 'rerequest'
		  });
        }


    render() {
    	const divStyle = {
		  float: "left"
		};

		const divs = {
			width: 450
		}

        return (
                <div style={divs}>
                    <button
                        className = "btn-facebook"
                        id         = "btn-social-login"
                        onClick = {this.handleFBLogin}
                        >
                            <span className="fa fa-facebook"></span>Sign in with Facebook
                    </button>
                    <br/>
                    <span id="status"></span>
                    	<table style={divStyle}>
			               <tbody>
			                  {this.state.data.map((person, i) => <TableRow key = {i} 
			                     data = {person} />)}
			               </tbody>
            			</table>
			            <table style={divStyle}>
			               <tbody>
			                  {this.state.data1.map((person, i) => <TableRow key = {i} 
			                     data = {person} />)}
			               </tbody>
			            </table>
                </div>
               );
    }
}


class TableRow extends React.Component {
   render() {
   
   	const trStyle={
			backgroundColor: "#D3D3D3"
		};

		const tdStyle={
			width: 120,
			height:165,
			borderRadius: 25
		};

		const fig={
			width: 110,
			height:120
		}
		
      return (
         <tr style={trStyle}>
            <td style={tdStyle}>
            <figure style={fig}>
            <img src={this.props.data.picture.data.url}/>
            <figcaption>{this.props.data.name}</figcaption>
            </figure>
            </td>
         </tr>
      );
   }
}


ReactDOM.render(<LoginComponent />, document.getElementById('app'));

