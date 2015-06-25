React.render(
  <h1>Hello, world!</h1>,
  document.getElementById('example')
);

//var data = [
  //{author: "Pete Hunt", text: "This is one comment"},
  //{author: "Jordan Walke", text: "This is *another* comment"}
//];

/*
 *Note that native HTML element names start with a lowercase letter, while custom React classes names begin with an uppercase letter.
 */

var Comment = React.createClass({
  render: function(){
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if(!text || !author){
      return;
    }
    // TODO: Send request to server
    
    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
    
    return;
  },
  render: function(){
    return (
      <div className="commentForm" onSubmit={this.handleSubmit}>
        <h4>Comment</h4>
        <form className="commentForm">
          <input type="text" placeholder="Your Name" ref="author" />
          <input type="text" placeholder="Say something…" ref="text" />
          <input type="submit" value="Post" />
        </form>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function(){
    var commentNodes = this.props.data.map(function(comment, index){
      return (
        //supress "unique key" by passing the mapping index iterator as the `key`
        //this isn't for the developer to necessarily worry about, but is helpful for react to keep track of things
        <Comment author={comment.author} key={index}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentBox = React.createClass({
  loadCommentFromServer: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data){
        this.setState({data:data});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment){
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function(){
    return {
      data: []
    };
  },
  componentDidMount: function(){
    this.loadCommentFromServer();
    setInterval(this.loadCommentFromServer, this.props.pollInterval);
  },
  render: function(){
    return (
      <div className="commentBox">
        <h1>
          Hello, world! I am a CommentBox.
        </h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

React.render(
  <CommentBox url="http://localhost:3000/public/comments.json" pollInterval={2000} />,
  document.getElementById('content')
);
