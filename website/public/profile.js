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
                type="text"
                onKeyUp={event => event.key === " " ? addTags(event) : null}
                placeholder="Press space to add tags"
            />
        </div>
    );
};

const TagsNoInput = props => {
    const [tags] = React.useState(props.tags);
    return (
        <div>
            <ul id="tags">
                {tags.map((tag, index) => (
                    <li key={index} className="tag">
                        <span className='tag-title'>{tag}</span>
                       
                    </li>
                ))}
            </ul>
        </div>
    );
};


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
        this.state = { familyName : "", givenName : "", email : "", role: "", image: "", register: [], tags: []} ;
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
                this.setState({ auth_id : data['auth_id'] });
                this.setState({ familyName : data['familyName'] });
                this.setState({ givenName : data['givenName'] });
                this.setState({ email : data['email'] });
                this.setState({ image : data['image'] });
                this.setState({ description : data['description'] });
                this.setState({ skill : data['skill'] });
                this.setState({ tags : data['tags'].split(',')});
            })
            .catch(error => {
                console.log(error);
            });
        fetch('/role').then(res => {return res.json()})
            .then(data => {
                console.log(data);
                this.setState({ role : data[0].name });
            })
            .catch(error => {
                console.log(error);
            });

    };
/*
    editprofil = (name, name2) => {
        return (
            <div className="form-group row">
                <label className="col-lg-3 col-form-label form-control-label">{name} </label>
                <div className="col-lg-9">
                    <input className="form-control" type="text" value={name2} onChange={e => this.setState({name2: e.target.value})}/>
                </div>
            </div>
        )
    };
 */
    render() {
        const selectedTags = tags => {
                console.log(tags);
                this.setState({ tags: tags});
        };
        return (
            <div>
                <AppNav />
                <div className="row my-2">
                    <div className="col-lg-8 order-lg-2">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a href="" data-target="#profile" data-toggle="tab" className="nav-link active">Profile</a>
                            </li>
                            <li className="nav-item">
                                <a href="" data-target="#edit" data-toggle="tab" className="nav-link">Edit</a>
                            </li>
                        </ul>
                        <div class="tab-content py-4">
               		   		 <div class="tab-pane active" id="profile">
			                    <h5 class="mb-3">{this.state.familyName} {this.state.givenName}</h5>
			                    <div class="row">
			                        <div class="col-md-6">
			                            <h6>À propos</h6>
			                            <p>
			                                {this.state.role}
			                            </p>
			                            <h6>Description</h6>
			                            <p>
			                                {this.state.description}
			                            </p>
			                        </div>
			                        <div class="col-md-6">
			                            <h6>Compétences</h6>
			                                 <TagsNoInput tags={this.state.tags}/>
			                        </div>
				                        <div class="col-md-12">
				                            <h5 class="mt-2"><span class="fa fa-clock-o ion-clock float-right"></span> Activité récente</h5>
				                            <table class="table table-sm table-hover table-striped">
				                                <tbody>                                    
				                                    <tr>
				                                        <td>
				                                            <strong>Abby</strong> joined ACME Project Team in <strong>`Collaboration`</strong>
				                                        </td>
				                                    </tr>
				                                </tbody>
				                            </table>
				                        </div>
                    			</div>
                			</div>

                            <div className="tab-pane" id="edit">
                                <div class="form-group row">
                                    <form role="form" onSubmit={this.handleSubmit}>
                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label">Prénom</label>
                                            <div className="col-lg-9">
                                                <input className="form-control" type="text" value={this.state.familyName} onChange={e => this.setState({familyName: e.target.value})}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label">Nom</label>
                                            <div className="col-lg-9">
                                                <input className="form-control" type="text" value={this.state.givenName} onChange={e => this.setState({givenName: e.target.value})}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label">Description</label>
                                            <div className="col-lg-9">
                                                <textarea className="list-card-composer-textarea js-card-title" value={this.state.description} onChange={e => this.setState({description: e.target.value})}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-lg-3 col-form-label form-control-label">Compétences</label>
                                            <div className="col-lg-9">
                                                <TagsInput selectedTags={selectedTags}  tags={this.state.tags}/>
                                            </div>    
                                        </div>
                                        <label class="col-lg-3 col-form-label form-control-label"></label>
                                        <div class="col-lg-9">
                                            <input type="reset" class="btn btn-secondary" value="Cancel"/>
                                            <input type="button" class="btn btn-primary" value="Save Changes" onClick={this.handleModify}/>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="col-lg-4 order-lg-1 text-center">
               		 <img src={this.state.image} className="mx-auto img-fluid img-circle d-block" alt="avatar"/>
                      <h6 className="mt-2">{this.state.email}</h6>
                </div>
            </div>
          </div>
        );
    }

    handleModify = async (event) => {
        event.preventDefault();

        var tags = JSON.stringify(this.state.tags);
        var finaltags = tags.replace(/\[|\]|"/g, "").replace(' ', '');

        const body = JSON.stringify({
            auth_id: this.state.auth_id,
            givenName: this.state.givenName,
            familyName: this.state.familyName,
            description: this.state.description,
            tags: finaltags,
        });
        console.log(body);
        const headers = {
            'content-type': 'application/json',
            accept: 'application/json',
        };

        await fetch('/updateprofil', {
            method: 'POST',
            headers,
            body,
        });
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(Profile), domContainer);