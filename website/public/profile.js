'use strict';
const e = React.createElement;
const AppNav = () => (
    <div>
        <nav class="navbar navbar-dark bg-dark">
            <a class="navbar-brand" href="/dashboard">Jobeet</a>
            <div className="justify-content-end">
                    <a role="button" className="btn btn-outline-info navbar-btn" href="/profile">Profil</a>
                    <a role="button" class="btn btn-outline-info navbar-btn" href="/logout">Se déconnecter</a>
            </div>
        </nav>
        <img src="static/business.jpeg" class="center"/>
    </div>
);

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { familyName : "", givenName : "", email : "", role: "", image: "" } ;
    }

    componentDidMount() {
        this.getProfile();
    }

    getProfile(){
        fetch('/user').then(res => {return res.json()})
            .then(data => {
                console.log(data);
                this.setState({ familyName : data['name']['familyName'] });
                this.setState({ givenName : data['name']['givenName'] });
                this.setState({ email : data['emails'][0]['value'] });
                this.setState({ image : data['picture'] });
            })
            .catch(error => {
                console.log(error);
            });
        fetch('/role').then(res => {return res.json()})
            .then(data => {
                console.log(data);
                this.setState({ role : data[0]['name'] });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        return (
            <div>
                <AppNav />
                <div className="card mt-4" style={{ width: '100%' }}>
                    <div className="card-body">
                            <img src={this.state.image} alt="Avatar" className='card-image'/>
                            <h3 className="card-title">{this.state.familyName} {this.state.givenName}</h3>
                        <h6 className="card-text">{this.state.role}</h6>
                        <br/>
                        <h6>Email</h6>
                        <p className="card-text">{this.state.email}</p>
                    </div>
                </div>
            </div >
        );
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(Profile), domContainer);