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
const Card = ({item}) => {
    const {sender_id, content} = item;
    return (
        <div class="card" Style="width: 100%;">
            <div class="card-body">
                <h5 class="card-title">{sender_id || "No Title"}</h5>
                <p class="card-text">{content || "No Content"}</p>
            </div>
        </div>
    )
};

var socket = io();
class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {message: [], sender_id: ""};
    }


    componentDidMount() {
        this.getProfile();
        this.getMsg();
        socket.on('msg', () => {
            this.getMsg();
        })
    }

    getProfile() {
        fetch('/user').then(res => {
            return res.json()
        }).then(user => {
            this.setState({sender_id: user.user_id});
        })
    }

    getMsg = async () => {
        const response = await fetch('/msg');
        const data = await response.json();
        console.log(data);
        this.setState({message: data});
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);

        const body = JSON.stringify({
            sender_id: this.state.sender_id,
            content: data.get('content'),
        });
        const headers = {
            'content-type': 'application/json',
            accept: 'application/json',
        };
        await fetch('/messages', {
            method: 'POST',
            headers,
            body,
        });
        socket.emit('message',body);
        await this.getMsg();
    }

    render() {
        return (
            <div>
                <AppNav/>
                {
                    this.state.message.length > 0 ? (
                        this.state.message.map(item =>
                            <Card item={item}
                            />)
                    ) : (
                        <div class="card mt-2 col-sm">
                            <div class="card-body">Aucun message</div>
                        </div>
                    )
                }
                <div className="card mt-4" style={{width: '100%'}}>
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="input-group input-group-sm mb-3">
                                <textarea name="content" className="form-control" placeholder="Message"></textarea>
                            </div>
                            <button type="submit" className="btn btn-info btn-sm ml-2">Envoyer</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
const domContainer = document.querySelector('#root');
ReactDOM.render(e(Message), domContainer);