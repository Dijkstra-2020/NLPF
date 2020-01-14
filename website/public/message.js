'use strict';
const e = React.createElement;
const AppNav = () => (
    <div>
        <nav class="navbar navbar-dark bg-dark">
            <a class="navbar-brand" href="/dashboard">Jobeet</a>
            <div className="justify-content-end">
                <a role="button" className="btn btn-outline-info navbar-btn" href="/profile">Profil</a>
                <a role="button" className="btn btn-outline-info navbar-btn" href="/messagerie">Messagerie</a>
                <a role="button" class="btn btn-outline-info navbar-btn" href="/logout">Se déconnecter</a>
            </div>
        </nav>
        <img src="static/business.jpeg" class="center"/>
    </div>
);
const Card = ({item}) => {
    const {username, content, createdAt} = item;
    return (
        <div class="card" Style="width: 100%;">
            <div class="card-body">
                <h5 class="card-title">{username}</h5>
                <p class="card-text">{content}</p>
                <p><small>{createdAt}</small></p>
            </div>
        </div>
    )
};

var socket = io();
class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {message: [], sender_id: "", users: [], receiver_id: ""};
    }

    componentDidMount() {
        this.getProfile();
        socket.on('msg', () => {
            this.getMsg();
        });
        this.getUsers();
    }

    getUsers() {
        fetch('/users').then(res => {
            return res.json()
        }).then(users => {
            users = users.map((user) => {
                return {value: user.user_id, label: user.nickname}
            });
            this.setState({users});
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
        const response = await fetch('/msg' + '?receiver_id=' + this.state.receiver_id + '&sender_id' + this.state.sender_id );
        var data = await response.json();
        const response2 = await fetch('/msg' + '?sender_id=' + this.state.receiver_id + '&receiver_id' + this.state.sender_id );
        const data2 = await response2.json();
        data = data.concat(data2);
        data = data.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
        console.log(data);
        this.setState({message: data});
    }

    handleInputChange = async (receiver) => {
        console.log(receiver.value);
        await this.setState({ receiver_id : receiver.value });
        await this.getMsg();
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);

        const body = JSON.stringify({
            sender_id: this.state.sender_id,
            content: data.get('content'),
            receiver_id: this.state.receiver_id
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
                <br/>
                <Select
                    label="Users"
                    options={this.state.users}
                    onChange={this.handleInputChange}
                />
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
                {
                    (this.state.receiver_id != "")  ? (
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
                    ) : (<div></div>)
                }
            </div>
        );
    }
}
const domContainer = document.querySelector('#root');
ReactDOM.render(e(Message), domContainer);