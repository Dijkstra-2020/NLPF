'use strict';
const e = React.createElement;

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = { show : 'none' };
    }

    showModal = () => {
        this.setState({ show: 'block' });
    };

    hideModal = () => {
        this.setState({ show: 'none' });
    };

    render() {
        return (
            <div>
                <div>
                    <nav className="navbar navbar-dark bg-dark">
                        <a className="navbar-brand" href="/">Jobeet</a>
                        <div className="justify-content-end">
                            <btn className="btn btn-outline-info navbar-btn" onClick={this.showModal}>Entreprises</btn>
                            <a role="button" className="btn btn-outline-info navbar-btn" href="/login">Se connecter</a>
                        </div>
                    </nav>
                    <img src="static/business.jpeg" className="center"/>
                </div>
                <div class="card mt-4" Style="width: 100%;">
                    <div class="card-body">
                        Veuillez vous connecter pour voir les dernières offres d'emplois
                    </div>
                </div>
                <div id="myModal" class="modal" style={{display: this.state.show}}>
                    <div class="modal-content">
                        <div className="modal-header">
                            <h4>Information</h4>
                            <span className="close" onClick={this.hideModal}>&times;</span>
                        </div>
                        <div className="modal-body">
                            <p>Pour avoir le rôle Entreprise, veuillez-nous contacter afin qu'on puisse vérifier votre statut d'entreprise.</p>
                            <p>Nous contacter par mail : John.Doe@jobeet.fr</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(Home), domContainer);