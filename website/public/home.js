'use strict';

const e = React.createElement;

const AppNav = () => (
    <div>
        <nav class="navbar navbar-dark bg-dark">
            <a class="navbar-brand" href="#">Jobeet</a>
            <a role="button" class="btn btn-outline-info navbar-btn" href="/login">Se connecter</a>
        </nav>
        <img src="static/business.jpeg" class="center"/>
    </div>
);

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <AppNav />
                <div class="card mt-4" Style="width: 100%;">
                    <div class="card-body">
                        Veuillez vous connecter pour voir les dernières offres d'emplois
                    </div>
                </div>
            </div>
        );
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(Home), domContainer);