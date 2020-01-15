'use strict';

const e = React.createElement;

const AppNav = () => (
    <div>
        <nav className="navbar navbar-dark bg-dark">
            <a className="navbar-brand" href="/dashboard">Jobeet</a>
            <div className="justify-content-end">
                <a role="button" className="btn btn-outline-info navbar-btn" href="/profile">Profil</a>
                <a role="button" className="btn btn-outline-info navbar-btn" href="/messagerie">Messagerie</a>
                <a role="button" className="btn btn-outline-info navbar-btn" href="/logout">Se déconnecter</a>
            </div>
        </nav>
        <img src="static/business.jpeg" className="center"/>
    </div>
);

const TagsInput = props => {
    const [tags, setTags] = React.useState(props.tags);
    const removeTags = indexToRemove => {
        setTags([...tags.filter((_, index) => index !== indexToRemove)]);
    };
    const addTags = event => {
        if (event.target.value !== "") {
            setTags([...tags, event.target.value]);
            props.selectedTags([...tags, event.target.value]);
            event.target.value = "";
        }
    };
    return (
        <div>
            <ul id="tags">
                {tags.map((tag, index) => (
                    <li key={index} className="tag">
                        <span className='tag-title'>{tag}</span>
                        <span className='close'
                            onClick={() => removeTags(index)}
                        >
                            x
                        </span>
                    </li>
                ))}
            </ul>
            <input
                name="tags"
                type="hidden"
                value={tags}
            />
            <input
                type="text"
                onKeyUp={event => event.key === " " ? addTags(event) : null}
                placeholder="Press space to add tags"
            />
        </div>
    );
};

const TagsNoInput = props => {
    const [tags, userTags] = React.useState(props.tags);

    console.log(userTags);
    const matches = userTags.filter((tag)=>{return tags.includes(tag)}).length;
    const percentage = (matches / userTags.length * 100).toFixed(2) + '%';

    return (
        <div>
            <ul id="tags">
                {tags.map((tag, index) => (
                    <li key={index} className="tag">
                        <span className='tag-title'>{tag}</span>
                    </li>
                ))}
            </ul>
            <ul id="tags">
                <li className="match">
                    <span className='tag-title'>Matching: </span>
                    <span className='matching'>
                        { percentage }
                    </span>
                </li>
            </ul>
        </div>
    );
};


const Card = ({ item, handleSubmit, handleEdit, handleDelete, handleCancel,handleRegister, show, candidat, userTags}) => {
    const { title, content, editMode} = item;
    const selectedTags = tags => {
            console.log(tags);
    };
    if (editMode) {
        return (
            <div class="card mt-4" Style="width: 100%;">
                <div class="card-body">
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="id" value={item.id} />
                        <div class="input-group input-group-sm mb-3">
                            <input type="text" name="title" class="form-control" placeholder="Title" defaultValue={title} />
                        </div>
                        <div class="input-group input-group-sm mb-3">
                            <textarea name="content" class="form-control" placeholder="Content" defaultValue={content}></textarea>
                        </div>
                        <div class="input-group input-group-sm mb-3">
                            <TagsInput name="tags" selectedTags={selectedTags}  tags={item.tags ? item.tags.split(',') : []}/>
                        </div>
                        <button type="button" class="btn btn-outline-secondary btn-sm" onClick={handleCancel}>Annuler</button>
                        <button type="submit" class="btn btn-info btn-sm ml-2">Sauvegarder</button>
                    </form>
                </div>
            </div>
        )
    } else {
        return (
            <div class="card mt-4" Style="width: 100%;">
                <div class="card-body">
                    <h5 class="card-title">{title || "No Title"}</h5>
                    <p class="card-text">{content || "No Content"}</p>
                    <TagsNoInput tags={item.tags ? item.tags.replace(/\s+/g, '').split(',') : []}  userTags={userTags}/>
                    <button type="button" class="btn btn-outline-danger btn-sm" onClick={handleDelete} style={{display: show}}>Supprimer</button>
                    <button type="submit" class="btn btn-info btn-sm ml-2" onClick={handleEdit} style={{display :show}}>Editer</button>
                    <button type="submit" className="btn btn-info btn-sm ml-2" onClick={handleRegister} style={{display: candidat}}>Postuler</button>
                </div>
            </div>
        )
    }
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], show : 'none', candidat: 'none', register: [], userTags: [], userRole: ""};
    }

    componentDidMount() {
        this.getPosts();
        this.getProfile();
        console.log("tags = " + this.state.userTags);
        fetch('/role').then(res => {return res.json()})
            .then(data => {
                if (data[0]['name'] === 'Entreprise')
                    this.setState({ show : 'inline-block' });
                else
                    this.setState({ candidat : 'inline-block' });
            })
            .catch(error => {
                console.log(error);
            });
    }

    getPosts = async () => {
        const response = await fetch('/posts');
        const data = await response.json();
        data.forEach(item => item.editMode = false);
        await fetch('/candidature').then(res => {return res.json()})
            .then(data => {
                console.log(data);
                this.setState({ register: data})
            })
            .catch(error => {
                console.log(error);
            });
        for(var i=0; i < data.length;i++){
            if (this.state.register.filter(e => e.postId === data[0].id).length > 0) {
                data.splice(i, 1);
            }
        }
        this.setState({data});
    }

    addNewPost = () => {
        const data = this.state.data;
        data.unshift({
            editMode: true,
            title: "",
            content: "",
            tags: ""
        })
        this.setState({ data })
    }

    handleCancel = async () => {
        await this.getPosts();
    }

    handleEdit = (postId) => {
        const data = this.state.data.map((item) => {
            if (item.id === postId) {
                item.editMode = true;
            }
            return item;
        });
        this.setState({ data });
    }

    handleDelete = async (postId) => {
        await fetch(`/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
        });
        await this.getPosts();
    }

    handleRegister = async (postId) => {
        const body = JSON.stringify({
            post_id: postId
        });
        console.log(body);
        const headers = {
            'content-type': 'application/json',
            accept: 'application/json',
        };
        await fetch('/candidature', {
            method: 'POST',
            headers,
            body,
        });
        await this.getPosts();
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        var data = new FormData(event.target);
        var tags = data.get('tags').replace(' ', '');
        console.log(tags);

        const body = JSON.stringify({
            title: data.get('title'),
            content: data.get('content'),
            tags: tags,
        });

        const headers = {
            'content-type': 'application/json',
            accept: 'application/json',
        };

        if (data.get('id')) {
            await fetch(`/posts/${data.get('id')}`, {
                method: 'PUT',
                headers,
                body,
            });
        } else {
            await fetch('/posts', {
                method: 'POST',
                headers,
                body,
            });
        }
        await this.getPosts();
    }

    getProfile = async () => {
        await fetch('/profiles').then(res => {return res.json()})
            .then(data => {
                console.log(data);
                this.setState({ userTags : data['tags'] ? data['tags'].replace(/\s+/g, '').split(',') : []});
                console.log(this.state.tags);

            })
            .catch(error => {
                console.log(error);
            });
        await fetch('/role').then(res => {return res.json()})
            .then(data => {
                console.log(data);
                this.setState({ userRole : data[0].name });
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        return (
            <div>
                <AppNav />
                <button type="button" class="mt-4 mb-2 btn btn-primary btn-sm float-right" onClick={this.addNewPost} style={{display: this.state.show}}>
                    Ajouter une nouvelle offre
                </button>
                {
                    this.state.data.length > 0 ? (
                        this.state.data.map(item =>
                            <Card item={item}
                                  handleSubmit={this.handleSubmit}
                                  handleEdit={this.handleEdit.bind(this, item.id)}
                                  handleDelete={this.handleDelete.bind(this, item.id)}
                                  handleCancel={this.handleCancel}
                                  handleRegister={this.handleRegister.bind(this, item.id)}
                                  show={this.state.show}
                                  candidat={this.state.candidat}
                                  userTags={this.state.userTags}
                            />)
                    ) : (
                        <div class="card mt-5 col-sm">
                            <div class="card-body">Aucune offre disponible</div>
                        </div>
                    )
                }
            </div >
        );
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(Dashboard), domContainer);