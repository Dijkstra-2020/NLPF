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
const Card = ({ item }) => {
    const { title, content } = item;
    return (
        <div class="card" Style="width: 100%;">
            <div class="card-body">
                <h5 class="card-title">{title || "No Title"}</h5>
                <p class="card-text">{content || "No Content"}</p>
            </div>
        </div>
    )
};

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { familyName : "", givenName : "", email : "", role: "", image: "", register: []} ;
    }

    componentDidMount() {
        this.getProfile();
        this.getPosts();
    }

    getPosts = async () => {
        await fetch('/candidature').then(res => {return res.json()})
            .then(data => {
                console.log(data);
                this.setState({ register: data})
            })
            .catch(error => {
                console.log(error);
            });
        const response = await fetch('/posts');
        const data = await response.json();
        const res = this.state.register.map(x => Object.assign(x, data.find(y => y.id === x.postId)));
        this.setState({ register: res });
    }

    getProfile(){
        fetch('/profiles').then(res => {return res.json()})
            .then(data => {
                console.log(data);
                this.setState({ familyName : data['familyName'] });
                this.setState({ givenName : data['givenName'] });
                this.setState({ email : data['email'] });
                this.setState({ image : data['image'] });
                this.setState({ description : data['description'] });
                this.setState({ skill : data['skill'] });
            })
            .catch(error => {
                console.log(error);
            });
        fetch('/role').then(res => {return res.json()})
            .then(data => {
                this.setState({ role : data['familyName'] });
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
                        <h6>Description</h6>
                        <p className="card-text">{this.state.description}</p>
                        <h6>Compétences</h6>
                        <p className="card-text">{this.state.skill}</p>
                    </div>
                </div>
                {
                    this.state.role === 'Candidat' ? (
                        <div>
                    <h5 className="centrer">Tes candidatures</h5>
                        </div>) : (<div></div>)
                }
                {
                    this.state.role === 'Candidat' ? (
                        this.state.register.length > 0 && this.state.role === 'Candidat' ? (
                            this.state.register.map(item =>
                                <Card item={item}
                                />)
                        ) : (
                            <div class="card mt-2 col-sm">
                                <div class="card-body">Inscrit à aucune offre</div>
                            </div>
                        )
                    ) : (<div></div>)
                }
            </div >
        );
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(Profile), domContainer);